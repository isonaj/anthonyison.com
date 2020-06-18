---
title: 'Clean code is Ravioli, not Spaghetti'
image: https://images.unsplash.com/photo-1556280725-d0a1d82c811b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=2000&fit=max&ixid=eyJhcHBfaWQiOjExNzczfQ
tags:
- principles
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

Single Responsibility is about having only one reason for change. It allows code to stay focused on one task, keeping things simpler. In the ravioli metaphor, it means that a request and everything required to execute that request should be in one place. There used to be a focus on layers: business logic, data access, etc. That's not ravioli, that's lasagne! (and it still make a mess) 

## Clean Architecture
In the past, software was designed in layers. Splitting these layers across multiple platforms led to n-tier architectures where an application would have a web server, an application server and a data server. This approach led to difficulties in scaling because a whole tier needed to be scaled at a time.

While it may look similar on the surface, Clean Architecture is more like ravioli code. Each request is bundled and contains all of the layers required for its function, and it can be scaled with a much finer control.

![CleanArchitecture](https://anthonyison.com/content/images/2020/03/CleanArchitecture.png)
**Figure: Clean architecture layout diagram**

## Enter the MediatR
[MediatR](https://github.com/jbogard/MediatR) is an amazing library that greatly simplifies the process of breaking up an application into individual requests. You can also separate Commands and Queries according to [CQRS](https://martinfowler.com/bliki/CQRS.html) really easily.

> MediatR is an open source implementation of the mediator pattern that doesn’t try to do too much and performs no magic.

A Request is a single ravioli. It does one thing (Single Responsibility) and it is passed everything it needs to do its job (Dependency Inversion). This means the Request is only reliant on its parameters and doesn't need to take on any dependencies on other resources. They are all passed in. This is a huge win for reducing dependencies and created more decoupled code. In addition, MediatR brings asynchronous processing, cancellation tokens and a pipeline that processes every request which is great for logging and performance metrics.

The great thing about MediatR is that each request can use IoC to pull in resources required to achieve the goal of the request. This stops the monster constructor methods in your controller! Instead, the Controller constructor can initialise mediator and each endpoint will look something like this:
```csharp
public GetAccount(int id) 
{
  _mediator.Send(new GetAccountRequest(id));
}
```
**Figure: Controller methods are much cleaner with Mediator**



If you want to go a lot deeper than I've discussed here, have a look at Jason Taylor's [blog post](https://jasontaylor.dev/clean-architecture-getting-started/). He's got a great template for getting started [here](https://github.com/jasontaylordev/CleanArchitecture). There are a lot of things going on in the template, so I recommend working step by step through his guide.