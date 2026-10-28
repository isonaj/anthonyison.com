# Work yourself out of the loop

## Working thesis

A senior engineer or leader should not measure their value by how many decisions stop without them.

If every difficult decision has to pass through the most senior person, expertise has not scaled. A queue has formed.

The goal is not to work yourself out of usefulness. It is to repeatedly work yourself out of being required.

## The Principal problem

As a Principal, I didn't have one strong senior engineer I could simply lean on to shape work for everyone else.

That meant I was doing a lot of the chewing myself: turning vague work into something clear enough to be picked up, surfacing the risks, filling in the design gaps, and helping people see what needed to happen next.

At first glance, the answer looked obvious: I needed a stronger senior.

But when I looked at the team more carefully, the capability was already there. It just wasn't in one person.

One person had strong technical skills.

Another had a great nose for design smells.

Another was good at design and documenting what the team was trying to do.

Together, they had much of the capability I needed.

The problem was the connections between them.

## The senior engineer existed across the network

Rather than trying to turn one person into a mini-me, I started trying to increase the bandwidth between those people.

Mentoring sessions weren't only private coaching. They needed reflection back to the team so that the learning could move.

Sprint planning became another opportunity. Instead of supplying the design, I could ask:

> Could you describe your plan at a high level?

Once the plan was in the room, other people could react to it.

The person who spotted design smells could challenge it.

The person with technical depth could see implementation risks.

The person who was strong at design and documentation could help structure the answer.

Eventually the conversation started to flow without me having to be the integration point.

That was the important change.

## Don't become the queue

This pattern turns up everywhere:

```text
Everyone -> Expert -> Work
```

The Principal who has to review every design.

The architect who must approve every boundary.

The tech lead who has to break down every story.

The platform engineer who is the only person who understands deployment.

The developer who is the only person allowed to touch the scary component.

All of them may look valuable. All of them can also be throughput limits.

Making the expert faster does not remove the topology.

## Scale the reasoning, not the person

A healthier progression looks more like:

```text
Expert answers questions
        ↓
Expert teaches reasoning
        ↓
People reason together
        ↓
Recurring reasoning becomes shared practice
        ↓
Where possible, practice becomes tooling / constraints / automation
        ↓
Expert moves to the next unsolved problem
```

The senior person's job changes as the capability spreads.

At first, they may provide answers.

Then they provide questions.

Then they create conversations between the right people.

Then they encode repeated judgement into practices, tests, architecture, tooling or automation.

Eventually the team can make that class of decision without waiting for them.

That is success.

## Questions are a scaling mechanism

"Could you describe your plan at a high level?" is different from telling someone the plan.

It exposes the current model in their head.

It gives other people something to respond to.

It creates a chance for gaps to be filled by the team rather than by the senior person.

This is the people equivalent of making a design concrete enough to review.

It also means the leader gets to see whether the team's reasoning is improving, not merely whether the final answer happens to be correct.

TODO: add two or three other real prompts that worked well, if I can remember them.

## Working yourself out of a job versus out of the loop

"Work yourself out of a job" is a familiar leadership phrase, but I don't think that is quite what I mean.

The aim is not to make the role unnecessary.

The aim is to make my presence unnecessary for the problems I have already helped the team learn to solve.

Then I can move to the next place where the organisation does not yet have that capability.

That is leverage.

## The uncomfortable incentive

Organisations can accidentally reward the opposite.

Being the person everybody needs feels important.

Your calendar fills up.

You're copied into everything.

People say:

> We can't do this without you.

That can look like seniority while actually describing a fragile system.

The harder question is whether the team can still make good decisions when I am not in the room.

## Relationship to architecture

This is not only a leadership idea.

Good architecture should also reduce dependence on the architect.

Clear ownership, good boundaries, tests, automated checks, shared language and explicit decision records let teams make more decisions locally without routing everything through a central authority.

That connects strongly to:

- [Code has an org chart too](06-code-has-an-org-chart-too.md)
- [One design is a proposal, not a decision](08-one-design-is-a-proposal-not-a-decision.md)
- [Business rules need a home](04-business-rules-need-a-home.md)

## Lines worth keeping

> If every difficult decision has to pass through the senior person, you haven't scaled their expertise. You've created a queue.

> The senior engineer I needed existed across the network.

> Eventually the conversation replaced me as the integration point.

> If things stop when I leave the room, I haven't scaled myself. I've just become important.

> The goal is not to work yourself out of usefulness. It is to repeatedly work yourself out of being required.

## Tension / pushback

- Sometimes the senior person really does need to make the decision. Avoid pretending delegation is always appropriate.
- Teams need enough context and psychological safety for open challenge to work.
- Distributed capability can create ambiguity if decision ownership is unclear.
- There is a difference between coaching someone through a decision and abandoning them to discover everything themselves.
- Automation can encode good judgement, but it can also fossilise yesterday's judgement.

## Open questions

- Is "work yourself out of the loop" the strongest title, or is there a better title around becoming the queue?
- How much of the Principal story can be told while keeping people anonymous and unidentifiable?
- Should the post stay mostly people-focused, with architecture as the ending, or deliberately alternate between the two?
- Is there a useful diagram showing the change from hub-and-spoke to a connected team?
