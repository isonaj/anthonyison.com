# Build enough UI to have the real conversation

## Working thesis

A working UI is not just a delivery artefact. It is a question you can put in front of people. Theoretical requirements conversations allow everyone to agree while imagining different systems; a working prototype exposes the conversation that could not happen while the idea was abstract.

## The idea

Ask, "Should users be able to select multiple pieces of equipment?" and everyone can say yes.

Put a screen in front of them and the useful conversation starts:

- "Not those ones."
- "Only the supervisor can do that."
- "Where is yesterday's selection?"
- "You can't use that machine and this one on the same shift."

The interface gives everyone the same thing to point at.

This overlaps with what UX is trying to validate: what people actually need rather than only what they say they need. The difference I want to explore is the value of having enough *working software* that the interaction itself can be tested.

## Hardcoded first

Start with hardcoded data. That makes the UI model cheap to change.

At this stage I am learning the shape of the screen and its view model, not proving that I can retrieve records from a database. If a conversation changes the model, I want to be able to throw it away and try another one immediately.

The loop is:

idea → working UI → conversation → corrected understanding → change the view model → repeat

That speed matters. Plumbing added too early makes every learning cycle more expensive.

## What this is not

This is not "the UI is the domain model" and it is not "design the whole system from the front end". The UI is one model for one purpose. Later layers have their own models and responsibilities.

## TODO / open questions

- Find a concrete example where a UI immediately revealed a requirement that a meeting had missed.
- How interactive does a prototype need to be before it becomes substantially more useful than a Figma/mock-up?
- Explain the distinction between validating workflow and prematurely committing to visual design.
- Show a small hardcoded view-model example and how quickly it can change.
- Link forward to "One model is not enough" rather than explaining all the boundaries here.
