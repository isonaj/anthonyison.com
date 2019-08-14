---
title: 'Clean code is Ravioli, not Spaghetti'
tags:
  - principles
image:
feature_img:
description:
keywords:
---
I'll start by saying, this is not a new idea. Everyone seems to know spaghetti code, even from the outside. Have you had that moment when you asked to change something and that's working just fine, but something else just failed six ways to Sunday? You, my friend, have spaghetti code.

Spagehitti code is basically code with poor boundaries. You know that friend in a co-dependent relationship, that just won't stand their ground and say no when they mean no? Or that work colleague that just says yes to everything and then complains they've got too much on their plate? That's the one. Code can do exactly the same thing. Code can bite off too much and it can become entangled with other code so you're not sure where one begins and the other ends.

To write better code, you need to follow [SOLID principles](https://en.wikipedia.org/wiki/SOLID). SOLID code conforms to:
* **S**ingle Responsibility Principle
* **O**pen Closed Principle
* **L**iskov Substition Principle
* **I**nterface Segregation Principle
* **D**ependency Inversion Principle

Ravioli is not like spaghetti. Spaghetti spreads out, through and tangles with other pieces of spaghetti. Ravioli, on the other hand, are small contained parcels with clear boundaries. Ravioli code conforms to the Single Responsibility Principle (and the Dependency Inversion Principle, but I'll discuss that later).

> "A class should have only one reason to change" - Uncle Bob Martin

Single Responsibility is about having only one reason for change. It allows code to stay focused on one task, keeping things simpler. In the ravioli metaphor, it means that a request and everything required to execute that request should be in one place. There used to be a focus on layers: business logic, data access, etc. That's not ravioli, that's lasagne! (and it still make a mess) Each ravioli has layers.

## Clean Architecture
In the past, software was designed in layers. Splitting these layers across multiple platforms led to n-tier architectures where an application would have a web server, an application server and a data server. This approach led to difficulties in scaling because a whole tier needed to be scaled at a time.

Clean Architecture produces ravioli code, which leads to a microservice-based architecture. Each service contains all of the layers required for its function, and it can be scaled with a much finer control.


## Enter the MediatR
[MediatR](https://github.com/jbogard/MediatR) is an amazing library that greatly simplifies the process of breaking up an application into individual requests. You can also separate Commands and Queries according to [CQRS](https://martinfowler.com/bliki/CQRS.html) really easily.

> MediatR is an open source implementation of the mediator pattern that doesn’t try to do too much and performs no magic.

A Request is a single ravioli. It does one thing (Single Responsibility) and it receives everything it needs to do its job into the constructor parameters (Dependency Inversion). In addition, MediatR brings asynchronous processing, cancellation tokens and a pipeline that processes every request which is great for logging and performance metrics.

