# One design is a proposal, not a decision

## Working thesis

A design is something we could build. A design decision explains why this is the thing we should build given the alternatives, constraints and trade-offs.

If I bring one polished design to a review, I haven't really invited people into a decision. I've asked them to find problems with my answer.

## The problem with one answer

The first plausible design gets an enormous anchoring advantage.

Once someone has spent time drawing the boxes, naming the services and polishing the diagram, alternatives start to feel expensive. Reviewers have to invent another answer while simultaneously understanding and critiquing the first one.

That is a poor environment for making a decision.

A design review can easily become:

> Here is the answer. Can anyone find a reason I shouldn't do it?

That is useful review, but it is not the same thing as choosing between credible options.

## Before polishing the answer, expose the choice

For consequential decisions, I want at least one credible alternative. Sometimes the alternative is simply: don't change anything yet.

The point is not to force three diagrams into every decision. Fake options are worse than no options:

- Option A: sensible.
- Option B: obviously worse.
- Option C: wildly expensive.

That is architecture theatre, not optioned design.

The useful questions are:

- What are we optimising for?
- What gets easier with this option?
- What gets harder?
- What are we committing ourselves to?
- What remains reversible?
- What would need to change for another option to become better?

## UI is a good example

This is one reason I like building enough UI to have the real conversation.

Show one screen and the feedback tends to be about the screen:

> Can you move that button?

Show genuinely different interpretations of the workflow and the conversation can become:

> Actually, we're designing this around the wrong workflow.

The alternatives are doing discovery work. They make the underlying choice visible.

This connects to [Build enough UI to have the real conversation](02-build-enough-ui-to-have-the-real-conversation.md), but the idea here is broader than UI. It applies to architecture, APIs, domain boundaries, team structures and implementation approaches.

## ADRs should record decisions, not only outcomes

An ADR that describes the winning architecture but omits the alternatives has lost much of the useful reasoning.

The rejected options matter because constraints change.

Six months later, an option we rejected may become correct. If the ADR captures why it lost, we can recognise when that reason is no longer true.

A useful ADR should make it possible to reconstruct the choice:

- Context.
- Credible options.
- Decision criteria.
- Trade-offs.
- Chosen option.
- Why the alternatives lost.
- What would cause us to revisit the choice.

## Design review versus design decision

A review asks whether a design is safe, coherent and internally sound.

A decision asks whether it is the right choice relative to the alternatives.

We need both.

Conflating them encourages teams to optimise one proposal before they have established that the proposal is solving the right problem.

## Tension / pushback

Optioned design has a cost. For small, reversible decisions, generating alternatives can be waste.

The answer is not "always produce three options". The amount of decision evidence should scale with consequence and reversibility.

A button colour does not need an ADR. A new system boundary probably deserves more than one plausible answer.

TODO: connect this to the quality process idea of same questions, scaled evidence.

## Lines worth keeping

> One design is a proposal, not a decision.

> Before polishing the answer, expose the choice.

> A design review finds problems with an answer. A design decision chooses between answers.

> Rejected alternatives are not historical trivia. They are part of the decision.

## Open questions

- What is the smallest useful option set? "At least one credible alternative" feels better than prescribing three.
- How strongly should reversibility drive the amount of design work?
- Use a concrete UI example, architecture example, or both?
- Include a small ADR before/after showing a weak outcome-only ADR versus one that records the decision?
