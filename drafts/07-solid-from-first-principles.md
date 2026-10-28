# SOLID from first principles

## Working thesis

I did not start with SOLID and try to make software conform to five rules. I kept running into problems — misplaced responsibility, models that allowed nonsense, dependencies pointing the wrong way, abstractions that lied — and some of the conclusions look a lot like SOLID. Some do not.

SOLID may be more useful as vocabulary for consequences than as a starting point for design.

## Single responsibility

Mostly aligned, but "one reason to change" can become abstract quickly.

The rule that feels more concrete to me is: **put the rule with the thing responsible for it.** Every important rule needs an owner. If five callers all need to remember the same invariant, responsibility is probably in the wrong place.

Related drafts: "Business rules need a home" and "Code has an org chart too".

## Open/closed

This is probably where I have the most suspicion.

"Open for extension, closed for modification" can become speculative abstraction: extension points for futures nobody has actually discovered.

Possible stance: make known change cheap; do not invent extension points for imaginary change.

Need to work this through rather than start with a conclusion.

## Liskov substitution

Likely useful when phrased as honesty in abstractions. If callers need to know which implementation they received before they can safely use an abstraction, the abstraction is lying about what it means.

## Interface segregation

Probably compatible with precise responsibility and contracts, but may be more consequence than organising principle for me. Need examples before deciding.

## Dependency inversion

Strongly aligned, but at the level of ownership and architectural direction, not "we use constructor injection".

Related draft: "Dependency injection isn't dependency inversion".

## What sits outside SOLID

Some of the principles I care about most are not really SOLID at all:

- working UI as a discovery tool
- multiple models for different purposes
- bounded contexts
- making invalid states hard or impossible to represent
- letting a model reveal capability
- systems thinking around queues, boundaries and ownership

That is part of the point. The acronym is not the architecture.

## TODO / open questions

- Write this last, after the earlier posts have forced the positions to become clearer.
- Test the tentative stance on OCP against good counterexamples.
- Find examples for LSP and ISP that are not textbook animal hierarchies or giant interfaces.
- Avoid creating a new five-rule manifesto. This should be a retrospective on where first-principles reasoning overlaps with SOLID and where it does not.
