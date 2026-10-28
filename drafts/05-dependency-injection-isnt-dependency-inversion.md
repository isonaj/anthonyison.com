# Dependency injection isn't dependency inversion

## Working thesis

Dependency inversion is about which part of a system is allowed to make a dependency decision. Dependency injection is one mechanism for wiring the answer together. Treating them as synonyms skips the architectural question.

## New is glue

`new` is useful as a signal. When a component constructs a substantial dependency directly, it has chosen both that dependency and its implementation.

That can be exactly right for a value object or a small internal collaborator. It is more consequential when domain/application code constructs a SQL repository, HTTP client implementation or infrastructure service.

The useful progression is:

`new SqlThing()`
→ I made a dependency choice here
→ should this component be allowed to choose?
→ who should own the abstraction?
→ dependency inversion
→ how will the implementation be supplied?
→ dependency injection

Most conversations I hear jump directly to the final line and start talking about containers.

## Ownership, not ceremony

The point is not "everything needs an interface". The point is to keep high-level policy from being owned by lower-level implementation details.

This ties back to the broader theme: put decisions and responsibility where they belong.

## TODO / open questions

- Use a small example that can be shown before/after without introducing a DI framework.
- Define where `new` is completely harmless so the post does not become a blanket rule.
- Explore whether interfaces owned by consumers make the inversion easier to see.
- Explain dependency injection after inversion, not before it.
- Find examples of code that uses constructor injection everywhere but still has dependencies pointing in the wrong architectural direction.
