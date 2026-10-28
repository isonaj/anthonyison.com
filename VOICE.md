# Voice

How anything on anthonyison.com should sound: posts, pages, the home page, descriptions, button labels. Written from how the existing posts already read, so new writing matches them.

## Who I am

A 90s software engineer: I started in 1999, when one person did the analysis, architecture, design, infrastructure and what we'd now call DevOps. Full stack before it had a name. I've worked across many industries, including as a contractor and consultant, and I've moved into leading teams, which means less time on the tools than I'd like.

What I'm learning is how to do more through people, and my view of that has changed. As a team lead around 2010 I found code easier to fix than people: a bug stays fixed, but people change over time and go back to old habits. As a tech lead I've learned people are far more interesting and varied than that, and the job isn't fixing them. It's introducing people and making opportunities for them, like the host of a party.

When I started, "software developer" or "application developer" was the whole deal: UX, analysis, build, infrastructure and ops were all part of building apps. So "developing software since 1999" is accurate, and fine to use. Today "developer" and "DevOps engineer" usually mean slices of the job, so for what I do now, describe me as a software engineer or tech lead.

## What the blog is for

1. **My notebook.** Write down what I've learned so I can look it up later. A post that solves my problem once will solve it again, for me or someone else.
2. **Sharing the craft.** How to model a domain, refactor, design, and think through owning your application's capabilities, rather than slapping tools together.
3. **What people find when they look me up.** Employers, recruiters, and conference, meetup and DDD organisers. Good notes on the craft are the best case I can make, so never write for the pitch at the expense of the first two. A post that holds up is also the seed of a talk.

The site has to look alive: a reader who sees years without a post assumes I've stopped. Aim for steady posts over perfect ones.

## Who is reading

Other engineers and tech leads who want to get better at the craft, me in a year's time looking something up, and the employers, recruiters and event organisers who find either. Some posts should also work for the business people affected by the software decisions being discussed. Write so a non-specialist can follow the point, and a specialist doesn't feel talked down to.

## How it sounds

- **First person, talking to one reader.** "I", "you", "we". Not "Anthony has…" or "the author".
- **Conversational, not corporate.** Write it the way I'd say it across a table. Contractions are fine. So is the odd aside ("But I digress…") or a joke at my own expense.
- **Plain analogies over jargon.** A queue is a call centre working through its tickets; a lock is the key to the toilets. When a technical term is the right word, use it, then say what it does.
- **Speak to the business and the engineer in the same post.** Don't remove technical detail to make a post accessible. Explain why the detail matters, show the real thing, and give less-technical readers a way through it. Code should prove the argument, not be a prerequisite for understanding it.
- **Concrete before abstract.** Where practical, use specific code, before-and-after examples, commands to run, or a real scenario. Explain the idea in plain language first, then name the technical principle. Don't make the reader invent an example to understand what I mean.
- **Show the mechanism, not just the lesson.** "I helped the team collaborate" is less useful than showing the prompt, practice or change that caused it. For technical posts that may be code, commands or a before-and-after model. For leadership posts it may be the question I asked, how I structured a conversation, or what I changed in the way the team worked. Make the change observable.
- **Use evidence appropriate to the argument.** Not every post needs code, but every important claim should have something concrete behind it: code, commands, a model, a decision, a conversation or a real outcome.
- **Honest about what went wrong.** Say what didn't work and what I'd do differently. That earns more trust than a polished success story.
- **Opinionated, with a reason.** "Let's not burn down the house" beats "there are tradeoffs to consider". Say what I'd pick and why.
- **Short and sharp where it counts.** Most sentences can run normally, but land the point in a short one. "Software is expensive. I mean, REALLY expensive."
- **Practical.** A post should leave the reader able to do something: a command to run, a question to ask, a mistake to avoid.

[Refactoring code - restructure, not rewrite](src/content/blog/refactoring-code-restructure-not-rewrite.md) is the reference for the intended technical/business balance: explain the business value in plain language, keep the technical detail, and give non-technical readers enough guidance to follow what the code demonstrates without needing to understand every line.

## Evergreen

Pages (About, the home page introduction, anything without a date) must still be true in five years.

- Anchor time to a year, never a count: "since 1999", not "over 20 years".
- No "currently", "recently", "these days" or "this year" on a page. Name the thing instead, or leave it out.
- Don't name an employer or client on a page unless I'm happy to update it the day that changes.

Posts are dated, so they may speak from their moment ("For the last 5 months…"). Their descriptions are reused in lists and RSS long after, so keep descriptions free of time words.

## My employer

The site links to my LinkedIn, which names my current employer, so every post can be read as a post about them. Write about the craft and about people, never about the company.

- Never name my current employer, and don't hint at it (its industry, its locations, its projects).
- My own career moves are mine to tell, including a role that changed in a restructure years ago.
- Nothing internal that's current: no restructures or org changes in motion, team counts or headcount plans, hiring targets, budgets or funding, delivery pressure, deadlines, systems, vendors or incidents.
- People on my teams stay anonymous and unidentifiable. A story about someone should be one they'd be happy to read.
- When a real situation makes the point, generalise it: "imagine you had to double your teams" rather than "my boss wants to double my four teams".
- Past employers and clients may be named when the story is positive and already public, like SSW.
- If in doubt, leave it out, or ask whether it would be fine on the company's own blog.

## Spelling and style

- Australian English: behaviour, organise, centre, visualise, licence (noun).
- Dates are written for an Australian reader: 11 December 2020.
- Sentence case for headings.
- Product names as their makers write them: Kubernetes, .NET, Docker Compose, Wrk.

## Words to avoid

- Hype and filler: "leverage", "synergy", "cutting-edge", "passionate", "rockstar", "ninja".
- Hedging that says nothing: "it's worth noting", "arguably", "in today's fast-paced world".
- "Authentically", by my own request in [Retrospective: 2019](src/content/blog/retrospective-2019.md).

## The terminal touches

The site's look borrows from the terminal (the prompt in the header, monospace dates). Keep that to the design. Words on the page stay plain: a nav link says "About", not `cd about/`.
