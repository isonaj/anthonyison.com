# Tests buy confidence

## Working thesis

The primary value of an automated test is justified confidence to change the software.

Tests cost money to create and maintain, but a useful test can keep producing value every time the system changes and the test runs again.

Quality should not depend on confidence. Confidence should depend on evidence.

Tests are one source of that evidence.

## The apparent contradiction

There are two ideas here that sound like they fight each other:

> Quality is about evidence, not confidence.

and:

> The primary outcome of tests is confidence.

I think both are true.

Tests do not prove that software is correct. They produce evidence about behaviours we chose to verify.

Confidence is what we get when that evidence is strong enough for the change we are making.

So the relationship is:

```text
Tests -> evidence -> justified confidence -> safer change
```

Not:

```text
Tests -> proof of quality
```

## Tests are an asset that can keep paying

Imagine I spend half an hour writing a test for a pricing rule.

The first time it runs, it helps me finish today's change.

If that were all it ever did, the economics might be questionable.

Then somebody refactors the pricing code three months later. The test runs again.

We upgrade a library. Again.

We reorganise the domain model. Again.

A new developer changes the calculation two years later. Again.

The feature that paid for the test may be long forgotten, but the test is still answering a useful question:

> Did this change break something we already knew mattered?

A test does not literally cost once. It has maintenance and execution cost. But the economic shape is interesting:

> A useful test has an upfront cost, an ongoing carrying cost, and an opportunity to return value every time the software changes.

That is why tests can grow in value over time.

## The metric is not test count

If confidence is the outcome, then these are not the goal:

- number of tests;
- percentage coverage;
- number of assertions;
- green ticks on a build.

They can all be useful evidence, but none of them tells me whether I can safely change the system.

A better question is:

> How much justified confidence does this suite give us to change the software?

Martin Fowler puts the idea very directly:

> "you don't have enough tests (or good enough tests) if you can't confidently change the code"

Source: https://martinfowler.com/articles/is-tdd-dead/

That feels much closer to the thing I actually care about than an arbitrary coverage target.

## A concrete example

Suppose the business rule is simple:

```csharp
public decimal CalculateTotal(decimal subtotal)
{
    if (subtotal >= 100m)
        return subtotal * 0.9m;

    return subtotal;
}
```

And there is a test:

```csharp
[Fact]
public void Orders_over_100_receive_a_ten_percent_discount()
{
    var total = pricing.CalculateTotal(120m);

    total.Should().Be(108m);
}
```

Later I change the implementation:

```csharp
public decimal CalculateTotal(decimal subtotal)
{
    return subtotal >= DiscountThreshold
        ? subtotal - (subtotal * DiscountRate)
        : subtotal;
}
```

The implementation changed. The promised behaviour did not.

The test is the evidence connecting those two statements.

A non-technical reader does not need to understand every line of C# to understand the point: we changed how the work is done without changing what the system promises to do.

That is the same kind of bridge used in [Refactoring code - restructure, not rewrite](../src/content/blog/refactoring-code-restructure-not-rewrite.md).

## Testing shows presence, not absence

Edsger Dijkstra's famous line is the right challenge to this entire argument:

> "Program testing can be used to show the presence of bugs, but never to show their absence!"

Source: https://www.cs.utexas.edu/~EWD/transcriptions/EWD03xx/EWD303.html

Exactly.

Which is why tests should not be described as proof that the system is correct.

A passing test establishes something narrower:

> Given this behaviour, these inputs and this assertion, the change did not violate the thing we chose to check.

Engineering often proceeds from evidence rather than proof.

The important part is being honest about what the evidence actually supports.

## Green tests are not all of quality

A green test suite might tell me:

```text
The tested behaviour still works.
```

It does not automatically tell me:

```text
The design is understandable.
The dependency direction is sensible.
The security model is sound.
The system is operable.
The change is maintainable.
The naming is clear.
```

Those need other evidence.

This is where "quality as evidence" matters.

Behavioural tests are one kind of evidence. Static analysis, architecture tests, review, observability, security checks, operational rehearsal and other techniques may cover other dimensions.

The quality question is not:

> Are the tests green?

It is:

> What evidence do we have that this change is good enough to proceed?

## Coverage is not confidence

High coverage can coexist with low confidence.

Imagine 95% code coverage, but every harmless refactor breaks fifty mocks because the tests are coupled to implementation details.

There are lots of tests.

The suite is green before the change.

And yet everybody is scared to change the code.

That suite is failing at one of the things I most want tests to provide.

Martin Fowler's coverage guidance is useful here because it avoids treating a percentage as the objective. A healthy suite should make production defects uncommon and make developers comfortable changing code.

Reference: https://martinfowler.com/bliki/TestCoverage.html

## Tests can become liabilities

"Tests accumulate value" must not become "never delete a test".

A test can cost more than the confidence it provides.

Examples:

- it fails randomly;
- it duplicates stronger tests;
- it asserts implementation details rather than behaviour;
- it takes a long time while answering a low-value question;
- it blocks sensible refactoring;
- it protects behaviour nobody wants anymore.

A useful rule might be:

> A test earns its keep by continuing to answer a useful question cheaply enough.

Sometimes deleting or replacing a test improves the quality of the test suite.

Martin Fowler makes a similar point in his test-pyramid discussion: if a higher-level test adds no useful additional confidence beyond lower-level tests, it may simply add maintenance and execution cost.

Reference: https://martinfowler.com/articles/practical-test-pyramid.html

## Legacy code is really about change

Michael Feathers' deliberately provocative definition is:

> "Legacy code is simply code without tests."

Reference: *Working Effectively with Legacy Code*; discussion also at https://understandlegacycode.com/blog/what-is-legacy-code-is-it-code-without-tests/

The interesting part is not whether the definition is universally true.

Code without tests can work perfectly well today.

The problem appears when we need to change it.

We don't know which assumptions we are about to disturb.

That suggests a deeper formulation for this post:

> Tests don't primarily tell me whether old code works. They tell me whether I can safely make new decisions about it.

## Tests and the software factory

This connects to the broader quality-engineering idea:

- quality gates should ask for evidence;
- automated checks are valuable because their marginal execution cost is low;
- evidence should scale with the risk and consequence of the change;
- a failure should improve the factory, not only fix the defect.

A good regression test is an example of that last point.

A defect escapes once. We learn something. We encode that learning so the same class of mistake becomes cheaper to detect forever after.

TODO: decide whether this belongs in this post or deserves a separate "a bug should make the factory better" post.

## Potential timeline visual

```text
Day 1        Feature implementation       test provides confidence
Month 2      Refactoring                  test provides confidence again
Month 5      Framework upgrade            again
Month 11     Pricing change               again
Year 2       New developer changes code   again
```

Same test. Different decision. New value each time.

## Quotes / references to verify before publishing

Martin Fowler, SelfTestingCode:

> "the confidence that you get to make changes to the system"

https://martinfowler.com/bliki/SelfTestingCode.html

Martin Fowler, Is TDD Dead?:

> "you don't have enough tests (or good enough tests) if you can't confidently change the code"

https://martinfowler.com/articles/is-tdd-dead/

Edsger Dijkstra, EWD303:

> "Program testing can be used to show the presence of bugs, but never to show their absence!"

https://www.cs.utexas.edu/~EWD/transcriptions/EWD03xx/EWD303.html

Michael Feathers:

> "Legacy code is simply code without tests."

Verify against the book before final publication.

## Lines worth keeping

> Quality should not depend on confidence. Confidence should depend on evidence.

> Tests are a confidence-producing asset.

> The product of testing isn't tests. It's justified confidence to change.

> A useful test has an upfront cost, an ongoing carrying cost, and an opportunity to return value every time the software changes.

> A test earns its keep by continuing to answer a useful question cheaply enough.

> Tests don't primarily tell me whether old code works. They tell me whether I can safely make new decisions about it.

## Tension / pushback

- Confidence is subjective; evidence needs to be concrete enough that the confidence is justified.
- More tests can increase confidence or reduce it if they create noise and friction.
- A test can protect behaviour while preserving a terrible design.
- Some failures are better prevented by types, models or architecture than tested repeatedly at runtime.
- Slow or flaky suites erode trust even when their coverage looks excellent.
- Tests themselves can encode the wrong business rule.

## Open questions

- Is "Tests buy confidence" the right title, or does it sound too transactional?
- Should the post use unit tests as the main example while explicitly saying the argument applies more broadly to automated verification?
- Is the strongest ending "The product of testing isn't tests. It's justified confidence to change"?
- How much of the quality-gates/software-factory thinking belongs here before this becomes two posts?
- Can confidence itself be treated as a useful team metric without pretending it is objectively measurable?
