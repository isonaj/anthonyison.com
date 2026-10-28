---
title: "Design the problems out"
description: "Instead of guarding against bad data with one more if statement, model the domain so the bad data can't exist. Slower to start, faster every week after."
slug: "design-the-problems-out"
publishedAt: "2026-11-03T09:00:00.000+10:00"
tags:
  - "principles"
  - "domain-modelling"
type: "post"
---

<!-- DRAFT. publishedAt is a placeholder: set the real date before merging. -->

A three-pin plug only goes in one way. Nobody prints a warning on the box telling you not to plug it in upside down, and nobody needs to. The problem was designed out.

Most software isn't built like that. It's built like a plug that fits both ways, with a sticker that says "please check the orientation". Then a second sticker, for the person who didn't read the first one.

## The bandaid habit

You've seen this code. You've probably written it. I certainly have.

An order has a status, a shipped date and a tracking number. The shipped date and tracking number are only meant to be set once it's shipped, so they're nullable. Then a bug comes in: an order shipped with no tracking number. So someone adds a check. Then a report falls over because a cancelled order had a shipped date. Another check. Every screen that shows an order learns to ask the same three questions before it trusts anything.

```ts
type Order = {
  status: 'draft' | 'placed' | 'shipped' | 'cancelled';
  shippedAt?: Date;
  trackingNumber?: string;
};

if (order.status === 'shipped' && order.trackingNumber && order.shippedAt) {
  // ...probably fine?
}
```

Each check is reasonable on its own. Together they're a tax. Every new feature pays it, every new developer has to learn where the traps are, and the one place someone forgets is next month's bug.

The if statement isn't fixing the problem. It's guarding against a state the model should never have allowed.

## Make the bad state impossible

So don't allow it. Model what the business actually means:

```ts
type Order =
  | { status: 'draft' }
  | { status: 'placed'; placedAt: Date }
  | { status: 'shipped'; placedAt: Date; shippedAt: Date; trackingNumber: string }
  | { status: 'cancelled'; placedAt: Date; reason: string };
```

Now a shipped order without a tracking number doesn't compile. A cancelled order can't have a shipped date, because there's nowhere to put one. The checks don't move somewhere else. They disappear.

That's the part people find counterintuitive. The quality came from removing code, not adding it.

<!-- TODO: swap in (or add) an example from a real project. A C# version with records and a private constructor would suit .NET readers. -->

## Trust starts at the bottom

The same idea works at the smallest scale. An email address passed around as a `string` has to be validated by everyone who touches it, or trusted blindly. An `EmailAddress` type that can only be created by parsing a valid one is checked once, at the edge, and then it's just true everywhere else.

I think of it as building trust from the lowest level up. If the small things are tested and solid (the value types, the rules, the transitions between states), the things on top don't need to be defensive. They plug in. They're shorter, they're easier to read, and they're easier to test, because there are fewer cases to cover.

Pouring a slab is like that. It's slow, it's not exciting, and nobody walks into a house and admires the foundations. But every wall after it goes up straight.

## Slow, then fast

I won't pretend this is free. Modelling the domain properly at the start is slower. You spend time with the people who know the business, learning their words and their rules. You argue about whether a "cancelled" order was ever really "placed". The first week can look like not much has been built.

<!-- TODO: an honest moment where this approach was questioned early on, and how it played out. -->

Then it turns. The second feature is quicker than the first, and the tenth is quicker still, because each one stands on things that are already true. The team isn't re-checking the same assumptions in every layer. The bug reports that do arrive are about real business rules, not about states that should never have existed.

The bandaid approach is the opposite curve. Fast at the start, and slower every week, as the checks pile up and everyone gets more careful.

## Where to start

You don't need a rewrite. Next time a bug comes in, before you add the if statement, ask one question:

**Should this state be possible at all?**

If the answer is no, change the model so it can't happen, and see how many checks you get to delete. Do that a few times and the codebase starts getting smaller while it gets better.
