---
title: User Secrets with .Net Core
publish: 2020-03-22 18:00
type: post
image: https://images.unsplash.com/photo-1483706600674-e0c87d3fe85b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=2000&fit=max&ixid=eyJhcHBfaWQiOjExNzczfQ
tags:
- dotnet
---
When a team works on a project, it's unlikely that all team members are happy using the same settings, especially when it comes to connection strings. The problem is that the settings file is going to be committed to the repository and then might be overwritten accidentally.

To avoid this issue, we create a template file, such as `appsettings.local_TEMPLATE.json` and each developer can copy that to `appsettings.local.json` and configure with the values they want in their local environment. `appsettings.local.json` doesn't committed.

If you are working on a dotnet core project, you should be using User Secrets for your local development settings.

## User Secrets
I hadn't looked at user secrets for a while. I thought it was about encrypting sensitive data. I'm only really interested in protecting production values. After all, `UseDevelopmentStorage=true` and `Server=.;Database=mydb;Trusted_Connection=True` aren't exactly national secrets.

> User secrets has nothing to do with encrypting sensitive data.

### dotnet user-secrets init
To get started, open a command prompt in your project's folder.

```bash
$ dotnet user-secrets init
```

This provides the ability to use user secrets, which will allow you to provide values locally for this project.

### dotnet user-secrets set
Let's set a value for our database and storage connection strings.

```bash
$ dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=.;Database=mydb;Trusted_Connection=True"
$ dotnet user-secrets set "ConnectionStrings:AzureStorage" "UseDevelopmentStorage=true"
```

### dotnet user-secrets list
Now what? Let's check what values have been set with `dotnet user-secrets list`.

```bash
$ dotnet user-secrets list
ConnectionStrings:DefaultConnection = Server=.;Database=mydb;Trusted_Connection=True
ConnectionStrings:AzureStorage = UseDevelopmentStorage=true
```

### dotnet user-secrets remove
If you added a setting and no longer need it, you can remove a single setting with the `remove` command. In this case, let's delete the value for OldSetting.

```bash
$ dotnet user-secrets remove "OldSetting"
```

### dotnet user-secrets clear
Finally, to clear all settings, you can use `dotnet user-secrets clear`.

```bash
$ dotnet user-secrets clear
```

That's pretty much all there is. The values are stored somewhere in your user folder but as I mentioned earlier, this is about local settings not protection of sensitive data.

Are you using user secrets yet?