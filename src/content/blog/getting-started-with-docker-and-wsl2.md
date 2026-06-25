---
title: "Getting started with Docker and WSL2"
slug: "getting-started-with-docker-and-wsl2"
publishedAt: "2020-09-16T22:49:56.000Z"
updatedAt: "2020-09-16T22:49:56.000Z"
tags:
  - "containers"
  - "docker"
featureImage: "https://images.unsplash.com/photo-1599299009482-3b5326fc52e4?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=2000&fit=max&ixid=eyJhcHBfaWQiOjExNzczfQ"
type: "post"
---

<p>If you know me, you know I love containers! Containers might not be a silver bullet, but I think they are very close. With the recent Windows 10 release, Microsoft has given us WSL2. Well, it was released back in May, but my shiny new Surface Book 3 has only just been allowed to install it.</p>
<blockquote>
<p>Actually, I have been waiting patiently for the 2004 update, but a few weeks ago Microsoft backported WSL 2 to earlier versions of Windows. Just install <a href="https://support.microsoft.com/en-us/help/4566116/windows-10-update-kb4566116">KB4566116</a> first.</p>
</blockquote>
<p>&quot;What is that?&quot; you ask? WSL2 (Windows Subsystem for Linux) is the new subsystem that allows you to run a Linux kernel on a Windows OS.<br>
For a windows docker user, this removes the need to run a Linux VM locally when running Linux containers.</p>
<h2 id="1enablewsl">1. Enable WSL</h2>
<p>In Powershell, in administrator mode:</p>
<pre><code class="language-bash">$ dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
</code></pre>
<h2 id="2enablevirtualmachineplatform">2. Enable 'Virtual Machine Platform'</h2>
<p>In Powershell, in administrator mode:</p>
<pre><code class="language-bash">$ dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
</code></pre>
<blockquote>
<p>In case you've got a version earlier than Windows 2004, you will need to run <code>Enable-WindowsOptionalFeature -Online -FeatureName VirtualMachinePlatform -NoRestart</code> instead.</p>
</blockquote>
<blockquote>
<p>You should probably restart your machine around now, just to make sure the rest runs smoothly.</p>
</blockquote>
<h2 id="3setwsl2asdefault">3. Set WSL 2 as default</h2>
<pre><code class="language-bash">$ wsl --set-default-version 2
</code></pre>
<blockquote>
<p>Note: this could give the error <code>WSL 2 requires an update to its kernel component</code>. I followed the supplied link to download the wsl update <a href="https://docs.microsoft.com/en-us/windows/wsl/wsl2-kernel">here</a>. Once installed, the command ran just fine.</p>
</blockquote>
<h2 id="4installadistro">4. Install a distro</h2>
<p>Open the Windows Store and search for your favourite Linux distro. In this case, I will get Ubuntu. Search for 'Ubuntu' and click 'Get'.</p>
<h2 id="4aoptionalinstallwindowsterminal">4a. (Optional) Install Windows Terminal</h2>
<p>If you don't have it already, Windows Terminal is kind of a big deal. When you run a few different systems, it becomes even better. Yes, you can install a distro and open a command prompt for that, but Windows Terminal will help you manage a bunch of different prompts in the one window.</p>
<p><a href="https://www.hanselman.com/">Scott Hanselman</a> loves it and has <a href="https://www.hanselman.com/blog/googleresults.html?&amp;sa=Search&amp;domains=www.hanselman.com&amp;sitesearch=www.hanselman.com&amp;client=pub-7789616507550168&amp;forid=1&amp;ie=UTF-8&amp;oe=UTF-8&amp;safe=active&amp;cof=GALT%3A%23B47B10%3BGL%3A1%3BDIV%3A%23A9501B%3BVLC%3A6F3C1B%3BAH%3Acenter%3BBGC%3AFFFFFF%3BLBGC%3A336699%3BALC%3AB47B10%3BLC%3AB47B10%3BT%3A000000%3BGFNT%3AA9501B%3BGIMP%3AA9501B%3BFORID%3A11&amp;hl=en&amp;q=wsl">heaps of posts</a> on how to install and configure it.</p>
<h2 id="5installdockerdesktop">5. Install Docker Desktop</h2>
<pre><code class="language-bash">$ choco install docker-desktop
</code></pre>
<p>If you're not installing your applications with Chocolatey, you should! It's a great way of installing your software, especially several packages at once, such as when you're building a new dev machine.</p>
<h2 id="conclusion">Conclusion</h2>
<p>So what's the difference really? Probably not much!  I happen to be running Windows Home for now, so I'm not able to swap Docker to Windows Containers. I'll have to upgrade to Pro at some point, but it's super cool that I can run Linux containers on Home! I expect WSL 2 would speed up switching between Linux and Windows containers or at least use significantly less resources while running since we no longer need a Linux VM to run our containers. I'm pretty excited about having closer access to Linux in and out of my containers.</p>
