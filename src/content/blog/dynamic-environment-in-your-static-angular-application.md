---
title: "Dynamic environment in your static Angular application"
slug: "dynamic-environment-in-your-static-angular-application"
publishedAt: "2019-04-25T05:22:00.000Z"
updatedAt: "2020-01-11T05:24:25.000Z"
tags:
  - "angular"
  - "dotnet"
featureImage: "__GHOST_URL__/content/images/2020/01/cover-2.jpg"
type: "post"
---

<p>I keep hitting the same problem when building Angular applications. Environment settings! They are easy to set up in development, but as you target different environments, the old &quot;one file per environment&quot; really doesn't cut it.<!-- more --> I don't want to rebuild my application just to deploy to production and if it's in a container? Pfft, good luck! I've solved this problem a few different ways in the past and I've just solved it again. But this time, it didn't feel quite so hacky, so I thought I'd post about it.</p>
<h2 id="problem">Problem</h2>
<p>Angular CLI provides an <code>environment.ts</code> for storing your global settings and you can select which environment file to use when you build. I want to build my application once and then deploy to different environments without rebuilding, however I can't change my environment settings on deploy or through environment variables. There are a few reasons I don't want to rebuild.</p>
<ol>
<li>I want to test in staging and then redeploy the artifact to production</li>
<li>I want to run it from a container</li>
</ol>
<h2 id="solution">Solution</h2>
<p>Ok, so this is not a new problem and it has been reasonably solved on server side deployments a few ways:</p>
<ol>
<li>Environment variables / web.config / appsettings.json - config is easily overridden in place and is often used for server config settings.</li>
<li>Rewrite on deploy - the deployment script itself can overwrite settings as it is deployed to configure the environment it is deploying to.</li>
</ol>
<h3 id="option1injectbootstrapsettingsintotheindexhtml">Option 1: Inject bootstrap settings into the index.html</h3>
<p>This was my first attempt at solving the problem. I added a comment in the index.html and created an MVC endpoint to load the index.html file, replace the comment with a script block to create a settings object and return the updated html page. It was good for keeping the number of requests down, but it felt a bit hacky.</p>
<h3 id="option2aseparatebootstrapscriptfile">Option 2: A separate bootstrap script file</h3>
<p>This approach was inspired by <a href="https://www.jvandemo.com/how-to-configure-your-angularjs-application-using-environment-variables/">this post</a>. The basic idea is to pull a separate self-executing script that contains our bootstrap settings from the <code>index.html</code>.</p>
<pre><code class="language-markup">&lt;!doctype html&gt;
&lt;html lang=&quot;en&quot;&gt;
  &lt;head&gt;
    &lt;meta charset=&quot;utf-8&quot;&gt;
    &lt;title&gt;My Awesome Angular app&lt;/title&gt;
    &lt;base href=&quot;/&quot;&gt;
    &lt;meta name=&quot;viewport&quot; 
          content=&quot;width=device-width, initial-scale=1, shrink-to-fit=no&quot;&gt;
    &lt;!-- Load environment variables --&gt;
    &lt;script src=&quot;assets/bootstrap.js&quot;&gt;&lt;/script&gt;  
  &lt;/head&gt;
  &lt;body&gt;
    &lt;app-root&gt;&lt;/app-root&gt;
  &lt;/body&gt;
&lt;/html&gt;
</code></pre>
<p>Next, create the <code>bootstrap.js</code> file in your assets folder. It should look something like this:</p>
<pre><code class="language-javascript">(function (window) {
  window.bootstrapSettings = {
    apiUrl: 'https://localhost:44384',
    production: false,
  };
}(this));
</code></pre>
<p>When the angular app loads, we now have a bootstrap object available to pull settings from. In this case, I can reference <code>window.bootstrapSettings.apiUrl</code> to find my api location, but I'm trying to use <code>environment.apiUrl</code>.</p>
<p>Next, we need to update <code>environment.ts</code> to bring in the bootstrap settings.</p>
<pre><code class="language-typescript">export const environment = Object.assign({
    production: false,
  },
  (window as any).bootstrapSettings);
</code></pre>
<p>At this point, we can build once and serve from different static sites by simply applying a different <code>assets/bootstrap.js</code> file with the new settings during deployment.</p>
<p>This is good, but we're serving from dotnet core, so we can do better. (If you're using node, the idea is not much different). The basic idea is to avoid serving the static bootstrap file and instead, send a bootstrap file based on our appsettings file, which we can easily override from our environment (web app, container, etc) using the middleware below.</p>
<pre><code class="language-csharp">public class EnvironmentBootstrap
{
    public string apiUrl { get; set; }
}

public static class EnvironmentBootstrapExtensions
{
    public static IApplicationBuilder UseEnvironmentBootstrap(
		this IApplicationBuilder builder, string path)
    {
        return builder.UseMiddleware&lt;EnvironmentBootstrapMiddleware&gt;(path);
    }
}

public class EnvironmentBootstrapMiddleware
{
    private readonly RequestDelegate _next;
    private readonly EnvironmentBootstrap _environment;
    private readonly string _endpointPath;

    public EnvironmentBootstrapMiddleware(
    	RequestDelegate next, 
        IOptions&lt;EnvironmentBootstrap&gt; options, 
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
            httpContext.Response.ContentType = &quot;application/javascript&quot;;
            await httpContext.Response.WriteAsync(
            	&quot;(function (window) { window.bootstrapSettings = &quot; +
            	JsonConvert.SerializeObject(_environment) + 
            	&quot;;}(this));&quot;);
        }
        else
            // Pass to next item in the pipeline
            await _next.Invoke(httpContext);
    }
}
</code></pre>
<p>Finally, activate the pipeline in the Startup.cs file:</p>
<pre><code class="language-csharp">public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        // ...
        services.Configure&lt;EnvironmentBootstrap&gt;(
            Configuration.GetSection(&quot;client&quot;));
        // ...
    }
                    
    public void Configure(IApplicationBuilder app)
    {
        // ...
        // Bootstrap the bootstrap.js file ahead of UseStaticFiles
        app.UseEnvironmentBootstrap(&quot;/assets/bootstrap.js&quot;);
        app.UseStaticFiles();
        app.UseSpaStaticFiles();
        // ...
    }
}
</code></pre>
<p>That's it! The project can now be built once and deployed to different environments, with angular client environment settings available to be configured from the environment itself. For an Azure Web app, set an Application Setting 'client:apiUrl' to override the client's <code>apiUrl</code> environment setting.</p>
<p>What do you think? Is there a better solution? What do you like or dislike about this approach?</p>
