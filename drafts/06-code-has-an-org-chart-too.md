# Code has an org chart too

## Working thesis

Software structure and organisational structure keep running into the same systems problems: ownership, boundaries, queues, hand-offs, decision rights, standards, bottlenecks and coordination costs. Both are systems for allocating responsibility and coordinating work.

## The parallels

An organisation has responsibilities, boundaries, queues, hand-offs, shared services, standards, local optimisation and bottlenecks.

Software does too.

Give one service responsibility for everything and it becomes a bottleneck. Give responsibility to everyone and consistency collapses.

Create too many boundaries and everything waits in queues. Create too few and everything becomes coupled.

Centralise every decision and scaling stops. Standardise everything and local components cannot adapt. Standardise nothing and integration becomes the work.

A badly designed class and a badly designed team can fail in remarkably similar ways.

## More than Conway's Law

This is adjacent to Conway's Law but the idea I want to explore is broader. The similarity is not only that organisations produce systems resembling their communication structures. It is that many of the same system dynamics recur at different scales.

Priorities create queues. Queues create waiting. Ownership affects feedback loops. Boundaries change coordination cost. Local optimisation can damage the whole. Capacity at one point can simply move a bottleneck elsewhere.

## TODO / open questions

- Find two or three strong organisational/software parallels rather than listing ten shallow ones.
- Connect queues and bottlenecks to systems thinking/flow without making the post about management theory.
- Be careful with the analogy: organisations contain people and social dynamics that code obviously does not.
- Decide how much Conway's Law belongs here versus as a reference point.
- Find an example where moving responsibility in software resembles fixing unclear decision rights in a team.
