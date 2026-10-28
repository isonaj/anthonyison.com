# Design the problems out

## Working thesis

A good model gets closer to reality. That doesn't only prevent invalid states: it often reveals capabilities that were hidden when the model was just a bag of data. Better modelling can make code disappear and make new behaviour obvious.

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

## The other side: capability appears

The stronger model does more than close off bad states. Once the software describes the real thing properly, valid operations and questions often become obvious too.

Instead of adding features to a loose record, transitions and capabilities start to emerge from the model: what can be cancelled, what can be shipped, which transitions are legal, what happened before the current state, and what operations belong together.

The model is not just a defensive wall. It is a way of discovering the system.

TODO: find a real example where improving the model unexpectedly exposed useful capability rather than merely preventing a bug.

## Trust starts at the bottom

The same idea works at the smallest scale. An email address passed around as a `string` has to be validated by everyone who touches it, or trusted blindly. An `EmailAddress` type that can only be created by parsing a valid one is checked once, at the edge, and then it's just true everywhere else.

I think of it as building trust from the lowest level up. If the small things are tested and solid — the value types, the rules, the transitions between states — the things on top don't need to be defensive. They plug in. They're shorter, easier to read and easier to test because there are fewer cases to cover.

Pouring a slab is like that. It's slow, it's not exciting, and nobody walks into a house and admires the foundations. But every wall after it goes up straight.

## Slow, then fast

I won't pretend this is free. Modelling the domain properly at the start is slower. You spend time with the people who know the business, learning their words and their rules. You argue about whether a "cancelled" order was ever really "placed". The first week can look like not much has been built.

Then it turns. The second feature is quicker than the first, and the tenth is quicker still, because each one stands on things that are already true. The team isn't re-checking the same assumptions in every layer.

The bandaid approach is the opposite curve. Fast at the start, and slower every week, as the checks pile up and everyone gets more careful.

## Where to start

Next time a bug comes in, before adding the if statement, ask:

**Should this state be possible at all?**

If the answer is no, change the model so it can't happen and see how many checks disappear.

## TODO / open questions

- Swap in or add a real project example. A C# version with records/private construction may suit the audience.
- Add an honest moment where this approach looked slower or was questioned early on.
- Develop the positive side: a model moving toward reality reveals capability, not only constraints.
- Be careful not to imply the model can ever be a perfect representation of reality; it is always purposeful and incomplete.
