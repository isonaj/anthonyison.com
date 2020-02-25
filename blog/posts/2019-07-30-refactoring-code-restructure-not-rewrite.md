---
title: 'Refactoring code - restructure, not rewrite'
publish: 2019-07-30 15:35:28
type: post
image: /refactoring-code-restructure-not-rewrite/cover.jpg
tags:
- principles
---
I see a lot of similarities between software and business processes. If I'm talking about a queuing mechanism, it often helps to describe it as a call centre managing their tickets, or a lock as being like a key for the toilets.<!-- more --> Refactoring then, would simply be a restructuring of a business or to give someone a new title or change teams around, however software developers often use it to mean they want to fire everyone and start over.

When we compare software processes and business processes, it can make it easy to communicate the benefits or drawbacks of a particular solution. Furthermore, when the stakeholders are engaged in the conversation **and they understand what's being discussed** they can guide the process more easily and it becomes a win-win for the software developers and the business. But I digress... 

Let's get back to the dreaded **rewrite**. It's always possible that a business is in a state where this is needed, however small changes to a working system can produce incredible results. Software is expensive. I mean, REALLY expensive. So, let's not burn down the house just because we no longer like the decor.

As a software developer, refactoring is one of your daily chores. The thing about a daily chore is that, when it's not done, it kind of builds up. If you never do your chores, you might find that you have a BIG job to get things neat and tidy again. And then, even if you stay on top of your chores, you might find you need a spring clean now and then just to get to the areas that aren't being kept daily.

> The word "refactoring" should never appear in a schedule. Refactoring is not a story or a backlog item. Refactoring is not a scheduled task. Refactoring is immediate and continuous. It's like washing your hands in the bathroom. You always do it. - [Uncle Bob Martin](https://twitter.com/unclebobmartin/status/1024254121338126336)

The problem is, software developers don't seem to agree on what refactoring is. It is often used to mean fixing a bug by writing "clean code" (or code that introduces design patterns) instead of "messy code". That's not refactoring though, and as a community, we need to understand what refactoring is.

## So what is it?

> I've never seen one before. No one has, but I'm guessing it's a white hole - [Kryten](https://www.youtube.com/watch?v=TxWN8AhNER0)

Refactoring is a change made to the internal structure of **existing software** to make it **easier to understand** and cheaper to modify **without changing its observable behaviour**. It does not mean "cleaning up code". Basically, if you are fixing an issue or adding new behaviour, you are NOT refactoring. It is often an iterative, mechanical process that is practically risk-free. How can it be risk-free? Well, the types of changes we are talking about are renaming methods or variables or extracting a small chunk of code from one method into another.

> WARNING: I'm about to show an example of refactoring some code. If you're not a software developer, focus on the difference between the starting code and the finished product.

Consider the following example:
```csharp
// ...
var t = this.Items.Sum(i => i.Qty * i.Price);
t -= Math.Round(this.Discount * t, 2);
var tt = Math.Round(t / 11, 2);
// ...
```

There are a few issues with this example. Let's fix some of the variables.
```csharp
var subtotal = this.Items.Sum(i => i.Qty * i.Price);
var discount = Math.Round(this.Discount * subtotal, 2);
var total = subtotal - discount;
var gst = Math.Round(total / 11, 2);
```

There is a code smell here with the parent accessing the child data (Qty and Price) to calculate the item subtotal. I think my first step here would be to add a get property to the child class to handle this.
```csharp
var subtotal = this.Items.Sum(i => i.Subtotal);
var discount = Math.Round(this.Discount * subtotal, 2);
var total = subtotal - discount;
var gst = Math.Round(total / 11, 2);
```

Finally, the tax calculation has a hardcoded tax rate and it's not clear that this is calculating Gst, so let's move it to a global Gst calculator. I'm also not sure how often Gst is calculated, but this provides a single location to update all Gst calculation in the case that the rate changes.
```csharp
var subtotal = this.Items.Sum(i => i.Subtotal);
var discount = Math.Round(this.Discount * subtotal, 2);
var total = subtotal - discount;
var gst = GstCalculator.CalculateTax(total);
```

As you can see, the refactored code should produce the same results as the original code and has significant improvements to readability, mostly from renaming variables. It may not be immediately obvious that the extra context from naming helps to document the code without adding comments.

## Refactoring Techniques
I mentioned earlier that refactoring is a mechanical process. In fact, there are lists of known [refactoring techniques](https://refactoring.guru/refactoring/techniques), the most well-known being Martin Fowler's [catalog](https://refactoring.com/catalog/). Be aware that for every refactoring, there is an equal and opposite refactoring. There is not really a "best way" to layout your code. Instead, you need to choose a refactoring that "improves" your code. If the code is overly complex, you might be looking at refactorings that reduce complexity. Alternatively, you might increase complexity to gain flexibility.

> Refactoring is a disciplined technique for restructuring an existing body of code, altering its internal structure without changing its external behaviour - [Martin Fowler](https://refactoring.com/)

The main benefits of refactoring are increased maintainability and extensibility with a low risk of introducing new issues. Like [Test Driven Development](https://en.wikipedia.org/wiki/Test-driven_development) (TDD), refactoring requires discipline to gain the full benefit from the practice. While each change seems too small to bother with, the cumulative effect of the practice will transform your code. 

If you want to learn more about refactoring techniques, I highly recommend the book, [Refactoring: Improving the Design of Existing Code](https://martinfowler.com/books/refactoring.html). Originally published in 1999, it's recently had a 2nd edition.

The idea of refactoring has been around for a long time and seems to be largely misunderstood by the software development community. By consistently refactoring before writing new code, software developers are able to improve the code base and improve maintainability and extensibility even to legacy applications.
