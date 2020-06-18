---
title: Setting up a new development machine
publish: 2020-06-18 17:04
type: post
image: https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=2000&fit=max&ixid=eyJhcHBfaWQiOjExNzczfQ
tags:
---
There are some posts that I look forward to getting on my soapbox, and others that are for storing infomation I think I'll find useful later. I'm noticing the information posts do tend to rate better, but I enjoy my soapbox more.

Setting up a new machine can take a while. Try to remember all the software you need, download each one by one, install, configure. It can take forever! The solution is SCRIPTING!

There are a few ways to automate and a few months ago, I would have recommended [Chocolatey](https://chocolatey.org/). Actually, I still do. However, there have been shots fired from Microsoft at the last Build, introducing [App Installer (WinGet)](https://www.microsoft.com/en-au/p/app-installer/9nblggh4nns1). I think it will be worth watching.

For now, go and get Chocolatey and install. To use Chocolatey effectively, there are a few things to consider:
1. Use an Administrator prompt. (I recommend Powershell)
2. Use -y to install without prompts. Better still, run `choco feature enable -n allowGlobalConfirmation` to set it globally.

## Utilities
First, let's get some utilities in place. I have picked the following utilities that I want on all my machines:

1. [7 Zip](https://www.7-zip.org/)
2. [TreeSize Free](https://www.jam-software.com/treesize_free)
3. [Paint.Net](https://www.getpaint.net/)
4. [Spotify](https://www.spotify.com/)
5. [Chrome](https://www.google.com/chrome/)
6. [Microsoft Edge](https://www.microsoft.com/en-us/edge)
7. [Firefox](https://www.mozilla.org/en-US/firefox/)
8. [1Password](https://1password.com/)
9. [Sublime Text](https://www.sublimetext.com/)
10. [Greenshot](https://getgreenshot.org/)
11. [Windows Terminal](https://www.microsoft.com/en-au/p/windows-terminal/9n0dx20hk701)

To install:
```
$ choco install 7zip treesizefree paint.net spotify googlechrome microsoft-edge firefox 1password sublimetext3 greenshot microsoft-windows-terminal
```

## Social
Next, I want my social applications. This includes any applications I use to communicate, including video recording.

1. [Skype](https://www.skype.com/en/)
2. [Slack](https://slack.com/intl/en-au/)
3. [Microsoft Teams](https://www.microsoft.com/en-au/microsoft-365/microsoft-teams/group-chat-software)
4. [Zoom](https://zoom.us/)
5. [OBS Studio](https://obsproject.com/)

To install:
```
$ choco install skype slack microsoft-teams zoom obs-studio
```

# Development
Finally, I'm looking at the heavy lifting. Take note that I'm not installing SQL Server or other heavy applications. I want to use Docker to download and run these kinds of resources in containers.

1. git
2. git-lfs
3. poshgit
4. nodejs
5. vscode
6. dotnetcore-sdk
7. postman
8. docker-desktop
9. azure-cli
10. microsoftazurestorageexplorer
11. azure-data-studio
12. nswagstudio
13. linqpad
14. visualstudio2019community

To install:
```
$ choco install git git-lfs poshgit nodejs vscode dotnetcore-sdk postman docker-desktop azure-cli microsoftazurestorageexplorer azure-data-studio nswagstudio linqpad visualstudiocommunity2019
```

## Non-Chocolatey
While it would be great to have all my applications installed with a single script, there are still some applications that don't have a Chocolatey install.

1. [Adobe XD](https://www.adobe.com/au/products/xd.html) - It's free Photoshop-like design software. Awesome for planning out the design of a web page for different screen sizes. I'm not good with it yet, but I'm very interested in learning.

## Summary
Chocolatey can install applications and windows features to ensure a development machine is set up the same way each time. It's so much faster than manually downloading and installing each application as you remember it. Instead, all of the work is in keeping and maintaining the list of applications that need to be installed. Where possible, use Chocolatey to install rather than installing a downloaded file.

To find an application, use:
```
$ choco search "<search string>"
```

To check what has been installed locally:
```
$ choco list -l
```

To check local chocolatey installs as well as other applications:
```
$ choco list -li
```

Happy ~~hunting~~~ installing~