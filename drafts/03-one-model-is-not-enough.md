# One model is not enough

## Working thesis

A screen, a business concept and a persistence representation are solving different problems. Trying to use one model from the database to the browser does not remove complexity; it forces each part of the system to accept somebody else's complexity.

## Several useful models

A typical flow might look something like:

screen
→ view model / BFF contract
→ API translation
→ application/domain model
→ bounded-context concepts
→ repository/persistence representation

and then back again.

The important part is that these shapes do not need to match.

The screen wants exactly what makes the interaction simple. A BFF or view model can match what the screen needs rather than exposing the internal domain.

The domain wants language, behaviour and invariants that match business concepts inside a bounded context.

Repositories should be specific to meaningful business concepts rather than turning arbitrary database tables into the application's public model.

Persistence wants a representation that can actually be stored and queried effectively.

The API manages transitions between these concerns rather than pretending they are one concern.

## Why UI-first still fits

UI-first does not mean propagating the UI model downward. It means discovering one model cheaply first. As the implementation moves inward, each boundary tells us more about the model it needs.

Start with hardcoded data in the UI. Then collect it from the API. Then deal with persistence. Each transition forces another useful modelling conversation.

## The failure mode

The classic alternative is database → generated/entity model → API → UI. Once the database representation exists first, it easily becomes "the model" simply because it is already there.

A useful question: why should a table designer get to decide what an Equipment looks like to a user, or what an Equipment means inside a bounded context?

## TODO / open questions

- Develop an example where a view model combines or reshapes several domain concepts for one screen.
- Show the reverse: one domain concept represented differently for persistence.
- Clarify what work belongs in the API/application layer when translating between models.
- Explore when mapping becomes pointless ceremony versus valuable boundary protection.
- Connect to bounded contexts without turning this into a DDD explainer.
