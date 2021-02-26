

If you know me, you know I love containers! Containers might not be a silver bullet, but I think they are very close. With the recent Windows 10 release, Microsoft have given us WSL2. Well, it was released back in May, but my shiny new Surface Book 3 has only just been allowed to install it. 

> Actually, I have been waiting patiently for the 2004 update, but a few weeks ago Microsoft backported WSL 2 to earlier versions of Windows. Just install [KB4566116](https://support.microsoft.com/en-us/help/4566116/windows-10-update-kb4566116) first.

"What is that?" you ask? WSL2 (Windows Subsystem for Linux) is the new subsystem that allows you to run a Linux kernel on a Windows OS.
For a windows docker user, this removes the need to run a linux vm locally when running linux containers.

## 1. Enable WSL
In Powershell, in administrator mode:
```bash
$ dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
```

## 2. Enable 'Virtual Machine Platform'
In Powershell, in administrator mode:
```bash
$ dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```

> In case you've got a version earlier than Windows 2004, you will need to run `Enable-WindowsOptionalFeature -Online -FeatureName VirtualMachinePlatform -NoRestart` instead.

> You should probably restart your machine around now, just to make sure the rest runs smoothly.

## 3. Set WSL 2 as default
```bash
$ wsl --set-default-version 2
```

> Note: this could give the error `WSL 2 requires an update to its kernel component`. I followed the supplied link to download the wsl update [here](https://docs.microsoft.com/en-us/windows/wsl/wsl2-kernel). Once installed, the command ran just fine.

## 4. Install a distro
Open the Windows Store and search for your favourite linux distro. In this case, I will get Ubuntu. Search for 'Ubuntu' and click 'Get'.

## 4a. (Optional) Install Windows Terminal
If you don't have it already, Windows Terminal is kind of a big deal. When you run a few different systems, it becomes even better. Yes, you can install a distro and open a commnd prompt for that, but Windows Terminal will help you manage a bunch of different prompts in the one window.

[Scott Hanselman](https://www.hanselman.com/) loves it and has [heaps of posts](https://www.hanselman.com/blog/googleresults.html?&sa=Search&domains=www.hanselman.com&sitesearch=www.hanselman.com&client=pub-7789616507550168&forid=1&ie=UTF-8&oe=UTF-8&safe=active&cof=GALT%3A%23B47B10%3BGL%3A1%3BDIV%3A%23A9501B%3BVLC%3A6F3C1B%3BAH%3Acenter%3BBGC%3AFFFFFF%3BLBGC%3A336699%3BALC%3AB47B10%3BLC%3AB47B10%3BT%3A000000%3BGFNT%3AA9501B%3BGIMP%3AA9501B%3BFORID%3A11&hl=en&q=wsl) on how to install and configure it.

## 5. Install Docker Desktop

```bash
$ choco install docker-desktop
```

If you're not installing your applications with Chocolatey, you should! It's a great way of installing your software, especially a number of packages at once, such as when you're building a new dev machine.

## Conclusion
So what's the difference really? Probably not much!  I happen to be running Windows Home for now, so I'm not able to swap Docker to Windows Containers. I'll have to upgrade to Pro at some point, but it's super cool that I can run linux containers on Home! I expect WSL 2 would speed up switching between Linux and Windows containers or at least use significantly less resources while running since we no longer need a Linux VM to run our containers. I'm pretty excited about having closer access to linux in and out of my containers.