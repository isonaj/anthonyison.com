---
title: "Setting up a new development machine"
slug: "setting-up-a-new-development-machine"
publishedAt: "2020-06-14T13:13:11.000Z"
updatedAt: "2021-11-25T22:10:35.000Z"
featureImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=2000&fit=max&ixid=eyJhcHBfaWQiOjExNzczfQ"
type: "post"
---

<p>There are some posts that I look forward to getting on my soapbox, and others that are for storing infomation I think I'll find useful later. I'm noticing the information posts do tend to rate better, but I enjoy my soapbox more.</p>
<p>Setting up a new machine can take a while. Try to remember all the software you need, download each one by one, install, configure. It can take forever! The solution is SCRIPTING!</p>
<p>There are a few ways to automate and a few months ago, I would have recommended <a href="https://chocolatey.org/">Chocolatey</a>. Actually, I still do. However, there have been shots fired from Microsoft at the last Build, introducing <a href="https://www.microsoft.com/en-au/p/app-installer/9nblggh4nns1">App Installer (WinGet)</a>. I think it will be worth watching.</p>
<p>For now, go and get Chocolatey and install. To use Chocolatey effectively, there are a few things to consider:</p>
<ol>
<li>Use an Administrator prompt. (I recommend Powershell)</li>
<li>Use -y to install without prompts. Better still, run <code>choco feature enable -n allowGlobalConfirmation</code> to set it globally.</li>
</ol>
<h2 id="utilities">Utilities</h2>
<p>First, let's get some utilities in place. I have picked the following utilities that I want on all my machines:</p>
<ol>
<li><a href="https://www.7-zip.org/">7 Zip</a></li>
<li><a href="https://www.jam-software.com/treesize_free">TreeSize Free</a></li>
<li><a href="https://www.getpaint.net/">Paint.Net</a></li>
<li><a href="https://www.spotify.com/">Spotify</a></li>
<li><a href="https://www.google.com/chrome/">Chrome</a></li>
<li><a href="https://www.microsoft.com/en-us/edge">Microsoft Edge</a></li>
<li><a href="https://www.mozilla.org/en-US/firefox/">Firefox</a></li>
<li><a href="https://1password.com/">1Password</a></li>
<li><a href="https://www.sublimetext.com/">Sublime Text</a></li>
<li><a href="https://getgreenshot.org/">Greenshot</a></li>
<li><a href="https://www.microsoft.com/en-au/p/windows-terminal/9n0dx20hk701">Windows Terminal</a></li>
</ol>
<p>To install:</p>
<pre><code>$ choco install 7zip treesizefree paint.net spotify googlechrome microsoft-edge firefox 1password sublimetext3 greenshot microsoft-windows-terminal
</code></pre>
<h2 id="social">Social</h2>
<p>Next, I want my social applications. This includes any applications I use to communicate, including video recording.</p>
<ol>
<li><a href="https://www.skype.com/en/">Skype</a></li>
<li><a href="https://slack.com/intl/en-au/">Slack</a></li>
<li><a href="https://www.microsoft.com/en-au/microsoft-365/microsoft-teams/group-chat-software">Microsoft Teams</a></li>
<li><a href="https://zoom.us/">Zoom</a></li>
<li><a href="https://obsproject.com/">OBS Studio</a></li>
</ol>
<p>To install:</p>
<pre><code>$ choco install skype slack microsoft-teams zoom obs-studio
</code></pre>
<h1 id="development">Development</h1>
<p>Finally, I'm looking at the heavy lifting. Take note that I'm not installing SQL Server or other heavy applications. I want to use Docker to download and run these kinds of resources in containers.</p>
<ol>
<li>git</li>
<li>git-lfs</li>
<li>poshgit</li>
<li>nvm</li>
<li>vscode</li>
<li>dotnetcore-sdk</li>
<li>postman</li>
<li>docker-desktop</li>
<li>azure-cli</li>
<li>microsoftazurestorageexplorer</li>
<li>azure-data-studio</li>
<li>nswagstudio</li>
<li>linqpad</li>
<li>visualstudio2019community</li>
<li>sqlitestudio</li>
<li>python</li>
<li>kubernetes-helm</li>
<li>kubernetes-cli</li>
<li>pulumi</li>
<li>ngrok</li>
<li>intellijidea-ultimate</li>
<li>openjdk17</li>
<li>maven</li>
</ol>
<p>To install:</p>
<pre><code>$ choco install git git-lfs poshgit nvm vscode dotnetcore-sdk postman docker-desktop azure-cli microsoftazurestorageexplorer azure-data-studio nswagstudio linqpad visualstudiocommunity2019 sqlitestudio python kubernetes-helm kubernetes-cli pulumi ngrok intellijidea-ultimate openjdk17 maven
$ nvm install latest
</code></pre>
<h2 id="nonchocolatey">Non-Chocolatey</h2>
<p>While it would be great to have all my applications installed with a single script, there are still some applications that don't have a Chocolatey install.</p>
<ol>
<li><a href="https://www.adobe.com/au/products/xd.html">Adobe XD</a> - It's free Photoshop-like design software. Awesome for planning out the design of a web page for different screen sizes. I'm not good with it yet, but I'm very interested in learning.</li>
</ol>
<h2 id="summary">Summary</h2>
<p>Chocolatey can install applications and windows features to ensure a development machine is set up the same way each time. It's so much faster than manually downloading and installing each application as you remember it. Instead, all of the work is in keeping and maintaining the list of applications that need to be installed. Where possible, use Chocolatey to install rather than installing a downloaded file.</p>
<p>To find an application, use:</p>
<pre><code>$ choco search &quot;&lt;search string&gt;&quot;
</code></pre>
<p>To check what has been installed locally:</p>
<pre><code>$ choco list -l
</code></pre>
<p>To check local chocolatey installs as well as other applications:</p>
<pre><code>$ choco list -li
</code></pre>
<p>Happy <s>hunting</s>~ installing!</p>
