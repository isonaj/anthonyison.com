# Business rules need a home

## Working thesis

I care less about whether someone calls a model "rich" or "anaemic" than whether the business rules have one authoritative home. I increasingly like behaviour on domain objects because they expose a deliberate API: callers can ask an Order to ship rather than grabbing a POCO and YOLO-ing its fields.

## An API for the domain

This:

```csharp
order.Status = OrderStatus.Shipped;
order.ShippedAt = clock.Now;
order.TrackingNumber = tracking;
```

lets every caller invent what shipping means.

This:

```csharp
order.Ship(tracking, clock.Now);
```

makes the model own the operation.

That is the part of encapsulation I have historically avoided and am now finding valuable: access is controlled and the available operations say something about the business.

## Rich object or POCO plus service?

DDD discussions often turn this into a fight about anaemic models. I am pushing toward DDD at the moment, partly to learn it, but I do not yet have a strong objection to a POCO plus a cohesive service containing the business rules.

Both can answer the important question: where does the rule live?

What I do object to is business behaviour dissolving across request handlers, controllers and incidental orchestration code, with each caller knowing some fraction of the invariant.

A practical test: important business rules should be accessible to focused unit tests without needing HTTP, a database, a queue or the whole running application.

## Reality pushes back

The clean rule "nobody can alter state except through public domain methods" runs into real systems:

- Hydrating thousands of objects from a database should not necessarily replay the transitions that originally created them.
- Deserialisation reconstructs a state that was accepted earlier.
- Bulk operations can make per-item validation or behaviour prohibitively expensive.
- ORMs and serializers have construction requirements of their own.
- Migration/import code may need to represent historical states the current application would not allow someone to create.
- Some rules require information outside the aggregate.

There is always something that pushes back.

That does not make encapsulation useless. It suggests a more useful rule:

**Make the safe path obvious and the unsafe path deliberate.**

Creating a new valid state and reconstructing an existing valid state are not the same operation. A rehydration path can be privileged without becoming the normal application API.

Likewise, performance pressure around ten thousand calls to `Item.ChangePrice()` might be telling us there is a real concept such as `PriceChangeBatch` that deserves its own rules and model.

Sometimes the thing pushing back is not merely a technical exception. It is reality telling us the model is incomplete.

## TODO / open questions

- Work through rich model versus POCO + domain service without turning it into doctrinal DDD.
- Separate invariants, policies involving external knowledge, and reconstruction/administrative escape hatches.
- Find a real bulk-operation example where the single-item API became the wrong abstraction.
- Explore whether "make the safe path obvious and the unsafe path deliberate" is the main line.
- Preserve the tension: the post should not end up saying "encapsulation good" and ignoring the costs.
