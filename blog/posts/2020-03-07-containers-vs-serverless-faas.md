---
title: "Containers vs Serverless"
publish: 2020-03-07 15:11
type: post
image: https://images.unsplash.com/photo-1495555687398-3f50d6e79e1e?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=2000&fit=max&ixid=eyJhcHBfaWQiOjExNzczfQ
tags:
- serverless
---
There are two major disruptive forces at play these days, containers and serverless. Both technologies claim to be the result of cloud-native architecture, but they're so different. Which one is better? What should I use in my next project? 

## How did we get here?
Back in the day, we built a server and ran it on physical hardware. In the early 2000s, we started running virtual machines instead. Pretty soon, we have on-premise servers running a bunch of virtual machines and things were Very Good&trade;.

### Infrastructure as a Service (IaaS)
In 2006, Amazon brought us "the cloud" by providing hardware to run virtual machines and we got the ability to rent hardware rather than buying. This led to the most basic ability to run in the cloud with an Infrastructure as a Service (IaaS) approach. To migrate your local systems to the cloud, you basically lift and shift. This is great because overall it's pretty straight forward and you don't have to change much. There are virtual machines, running in the cloud rather than locally. The great thing about this is that you no longer have to worry about broken hard drives or burnt-out memory. You don't have to run your hardware for as long as possible to get your money's worth. The biggest benefit, though, is that you can add a bunch of resources as needed and only pay for the time you use it. Now THAT is something you can't do with on-prem hardware.

### Platform as a Service (PaaS)
Virtual machines are all well and good, but you still need to keep your operating systems up to date and it's pretty manual to set up each machine and install the required services. Microsoft Azure shot to fame when they provided App Service, a PaaS offering. With App Service, the platform provides the ability to host a service within a scalable framework. Resources can be added and removed with a slider and even automatically scale based on CPU and/or memory usage.

With IaaS, we no longer need to worry about hardware failures and we can add and remove resources with relative ease. With PaaS, we can also offload operating system updates and some other things like certificate management, domain management, etc.

So, here we are, "in the cloud". We're still building applications like we used to, but now we have "the ability to scale" as opposed to scalability. It's better because we no longer have this blob that contains the application(s), web server, operating system, hardware, networking, etc. With the cloud provider taking care of the infrastructure, we get to focus on the application. After all, that's where we are providing greatest value.

## Separating Application and Infrastructure
A cloud-native application is one that has a clear separation between the application and infrastructure. The application needs to have clear dependencies on parts of the infrastructure and cloud providers can provide these infrastructure blocks to the application. They manage the infrastructure. You manage the application. Cool huh?

So what in the heck do I do with that? Well, that's where we start with containers.

### Containers
A container is essentially a single running application, including all correctly versioned, required libraries. This provides high consistency between a development environment, staging and production. The image is built once, from a script, so the process is highly reproducible and stored in a registry. This means you can add hardware to your production system and it can fetch your application and run it pretty much automatically.

This is where Kubernetes comes in. Kubernetes is a container orchestrator that runs on IaaS components (ie. virtual machines, disk storage, etc) to provide a PaaS service for containers. It can be configured to automatically scale the infrastructure or the application (container) based on CPU and memory loads.

That's great and a huge step forward from where we've come. You're still patching your application's libraries though. You working directly with a highly abstracted infrastructure model that allows you to work with different cloud providers with no changes to your application (container) and little to no changes to your infrastructure code.

| Pros | Cons |
|---|---|
| Portability | High idle running costs |
| Consistency | Apply security patches |
| Platform agnostic | |
| "Fast" scalability | |

### Functions as a Service (FaaS)
> [What if I told you](https://medium.com/@mcdreeamie/false-memories-what-if-i-told-you-about-morpheus-and-the-mandela-effect-65cd311bcd5f) you don't need a server? - Morpheus

Functions as a Service (FaaS) takes a totally different approach. Rather than build an application to receive calls, you can have that provided as a service and just provide the functions that need to run when "something" happens. An application usually exposes endpoints, runs timers and listens to other services (eg. service bus). So instead, you can provide the function to run and have the infrastructure execute the function when the timer fires or the endpoint is hit.

This is where "serverless" comes from. In a PaaS offering, you're not dealing with hardware per se, but you are still managing the number of virtual machines at some level and it takes a while to spin up a new VM. With FaaS, you literally DO NOT CARE what infrastructure is running your application. The whole lot is managed by your cloud provider.

Instead, your code is executed in an event-based manner, and there is a small charge for each execution. This could be based on a timer, service bus message, webhook or other event like saving a file to storage. This aligns naturally with event-based and integration solutions.

| Pros | Cons |
|---|---|
| Pay per execution | Totally different architecture |
| No idle cost | Will melt a conventional database |
| Brilliant integration tool | Cold starts |
| "Obscene" scalability | Difficult to manage complexity |
| Great for event-based architecture | |

## Which should I use?
A good consultant will tell you the answer to every question is "it depends". 

If you're currently hosting a web application, the answer is likely to use containers. There is some overheard learning the container ecosystem, but I think it's worth it. It's closely aligned with standard web application practices. There are also image scanning services that will provide a security report on the attack surface on your image which would improve the overall practices of many software houses.

If you're building a new application, consider serverless from the running cost and scalability perspective. Your costs will be directly related to your success (or at least activity), rather than having a fixed running cost. It's also more prepared to handle the load of being an overnight success.

If you're integrating two separate systems, I think it's seriously worth considering serverless. The integration story in the serverless space is incredible.

It's worth considering your application dependencies. That is, when your serverless application is handling high load, can your database handle that many separate connections?

Which do you prefer? Have you used either? Please let me know what you think in the comments below.