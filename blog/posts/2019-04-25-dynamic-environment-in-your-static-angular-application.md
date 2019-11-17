---
title: Dynamic environment in your static Angular application
date: 2019-04-25
image: /dynamic-environment-in-your-static-angular-application/small_cover.jpg
feature_img: cover.jpg
tags: 
- dotnet 
- angular
identifier: ghost-5cbfbe3b21b29c00018dd251
---
I keep hitting the same problem when building Angular applications. Environment settings! They are easy to set up in development, but as you target different environments, the old "one file per environment" really doesn't cut it. I don't want to rebuild my application just to deploy to production and if it's in a container? Pfft, good luck! I've solved this problem a few different ways in the past and I've just solved it again. But this time, it didn't feel quite so hacky, so I thought I'd post about it.

## Problem
Angular CLI provides an `environment.ts` for storing your global settings and you can select which environment file to use when you build. I want to build my application once and then deploy to different environments without rebuilding, however I can't change my environment settings on deploy or through environment variables. There are a few reasons I don't want to rebuild.

1. I want to test in staging and then redeploy the artifact to production
2. I want to run it from a container

## Solution
Ok, so this is not a new problem and it has been reasonably solved on server side deployments a few ways:

1. Environment variables / web.config / appsettings.json - config is easily overridden in place and is often used for server config settings.
2. Rewrite on deploy - the deployment script itself can overwrite settings as it is deployed to configure the environment it is deploying to.

### Option 1: Inject bootstrap settings into the index.html
This was my first attempt at solving the problem. I added a comment in the index.html and created an MVC endpoint to load the index.html file, replace the comment with a script block to create a settings object and return the updated html page. It was good for keeping the number of requests down, but it felt a bit hacky.

### Option 2: A separate bootstrap script file
This approach was inspired by [this post](https://www.jvandemo.com/how-to-configure-your-angularjs-application-using-environment-variables/). The basic idea is to pull a separate self-executing script that contains our bootstrap settings from the `index.html`.

```markup
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>My Awesome Angular app</title>
    <base href="/">
    <meta name="viewport" 
          content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <!-- Load environment variables -->
    <script src="assets/bootstrap.js"></script>  
  </head>
  <body>
    <app-root></app-root>
  </body>
</html>
```

Next, create the `bootstrap.js` file in your assets folder. It should look something like this:
```javascript
(function (window) {
  window.bootstrapSettings = {
    apiUrl: 'https://localhost:44384',
    production: false,
  };
}(this));
```

When the angular app loads, we now have a bootstrap object available to pull settings from. In this case, I can reference `window.bootstrapSettings.apiUrl` to find my api location, but I'm trying to use `environment.apiUrl`.

Next, we need to update `environment.ts` to bring in the bootstrap settings.

```typescript
export const environment = Object.assign({
    production: false,
  },
  (window as any).bootstrapSettings);
```

At this point, we can build once and serve from different static sites by simply applying a different `assets/bootstrap.js` file with the new settings during deployment.

This is good, but we're serving from dotnet core, so we can do better. (If you're using node, the idea is not much different). The basic idea is to avoid serving the static bootstrap file and instead, send a bootstrap file based on our appsettings file, which we can easily override from our environment (web app, container, etc) using the middleware below.

```csharp
public class EnvironmentBootstrap
{
    public string apiUrl { get; set; }
}

public static class EnvironmentBootstrapExtensions
{
    public static IApplicationBuilder UseEnvironmentBootstrap(
		this IApplicationBuilder builder, string path)
    {
        return builder.UseMiddleware<EnvironmentBootstrapMiddleware>(path);
    }
}

public class EnvironmentBootstrapMiddleware
{
    private readonly RequestDelegate _next;
    private readonly EnvironmentBootstrap _environment;
    private readonly string _endpointPath;

    public EnvironmentBootstrapMiddleware(
    	RequestDelegate next, 
        IOptions<EnvironmentBootstrap> options, 
        string path)
    {
        _next = next;
        _endpointPath = path;
        _environment = options.Value;
    }

    public async Task Invoke(HttpContext httpContext)
    {
        // Short circuit on request for bootstrap.js
        if (httpContext.Request.Path
            .Equals(_endpointPath, StringComparison.Ordinal))
        {
            httpContext.Response.ContentType = "application/javascript";
            await httpContext.Response.WriteAsync(
            	"(function (window) { window.bootstrapSettings = " +
            	JsonConvert.SerializeObject(_environment) + 
            	";}(this));");
        }
        else
            // Pass to next item in the pipeline
            await _next.Invoke(httpContext);
    }
}
```

Finally, activate the pipeline in the Startup.cs file:
```csharp
public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        // ...
        services.Configure<EnvironmentBootstrap>(
            Configuration.GetSection("client"));
        // ...
    }
                    
    public void Configure(IApplicationBuilder app)
    {
        // ...
        // Bootstrap the bootstrap.js file ahead of UseStaticFiles
        app.UseEnvironmentBootstrap("/assets/bootstrap.js");
        app.UseStaticFiles();
        app.UseSpaStaticFiles();
        // ...
    }
}
```

That's it! The project can now be built once and deployed to different environments, with angular client environment settings available to be configured from the environment itself. For an Azure Web app, set an Application Setting 'client:apiUrl' to override the client's `apiUrl` environment setting.

What do you think? Is there a better solution? What do you like or dislike about this approach?