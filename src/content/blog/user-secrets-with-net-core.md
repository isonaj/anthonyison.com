---
title: "User Secrets with .Net Core"
slug: "user-secrets-with-net-core"
publishedAt: "2020-03-22T08:00:00.000Z"
updatedAt: "2020-05-16T11:35:36.000Z"
tags:
  - "dotnet"
featureImage: "https://images.unsplash.com/photo-1483706600674-e0c87d3fe85b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=2000&fit=max&ixid=eyJhcHBfaWQiOjExNzczfQ"
type: "post"
---

<p>When a team works on a project, it's unlikely that all team members are happy using the same settings, especially when it comes to connection strings. The problem is that the settings file is going to be committed to the repository and then might be overwritten accidentally.</p>
<p>To avoid this issue, we create a template file, such as <code>appsettings.local_TEMPLATE.json</code> and each developer can copy that to <code>appsettings.local.json</code> and configure with the values they want in their local environment. <code>appsettings.local.json</code> doesn't committed.</p>
<p>If you are working on a dotnet core project, you should be using User Secrets for your local development settings.</p>
<h2 id="usersecrets">User Secrets</h2>
<p>I hadn't looked at user secrets for a while. I thought it was about encrypting sensitive data. I'm only really interested in protecting production values. After all, <code>UseDevelopmentStorage=true</code> and <code>Server=.;Database=mydb;Trusted_Connection=True</code> aren't exactly national secrets.</p>
<blockquote>
<p>User secrets has nothing to do with encrypting sensitive data.</p>
</blockquote>
<h3 id="dotnetusersecretsinit">dotnet user-secrets init</h3>
<p>To get started, open a command prompt in your project's folder.</p>
<pre><code class="language-bash">$ dotnet user-secrets init
</code></pre>
<p>This provides the ability to use user secrets, which will allow you to provide values locally for this project.</p>
<h3 id="dotnetusersecretsset">dotnet user-secrets set</h3>
<p>Let's set a value for our database and storage connection strings.</p>
<pre><code class="language-bash">$ dotnet user-secrets set &quot;ConnectionStrings:DefaultConnection&quot; &quot;Server=.;Database=mydb;Trusted_Connection=True&quot;
$ dotnet user-secrets set &quot;ConnectionStrings:AzureStorage&quot; &quot;UseDevelopmentStorage=true&quot;
</code></pre>
<h3 id="dotnetusersecretslist">dotnet user-secrets list</h3>
<p>Now what? Let's check what values have been set with <code>dotnet user-secrets list</code>.</p>
<pre><code class="language-bash">$ dotnet user-secrets list
ConnectionStrings:DefaultConnection = Server=.;Database=mydb;Trusted_Connection=True
ConnectionStrings:AzureStorage = UseDevelopmentStorage=true
</code></pre>
<h3 id="dotnetusersecretsremove">dotnet user-secrets remove</h3>
<p>If you added a setting and no longer need it, you can remove a single setting with the <code>remove</code> command. In this case, let's delete the value for OldSetting.</p>
<pre><code class="language-bash">$ dotnet user-secrets remove &quot;OldSetting&quot;
</code></pre>
<h3 id="dotnetusersecretsclear">dotnet user-secrets clear</h3>
<p>Finally, to clear all settings, you can use <code>dotnet user-secrets clear</code>.</p>
<pre><code class="language-bash">$ dotnet user-secrets clear
</code></pre>
<p>That's pretty much all there is. The values are stored somewhere in your user folder but as I mentioned earlier, this is about local settings not protection of sensitive data.</p>
<p>Are you using user secrets yet?</p>
