---
title: "I could explain how AI works. Then it showed me I couldn't"
description: "I thought AI could only give back what it had taken in, with a roll of the dice. Then one model told me I was looking in the wrong place."
slug: "i-could-explain-how-ai-works"
publishedAt: "2026-11-22T09:00:00.000+10:00"
tags:
  - "ai"
type: "post"
---

This post is about nine months late. It belongs in February, when it happened, but I didn't have the blog going then. So this is me looking back, and then catching up.

Last year I went to NDC: two days of training on AI with Steve Sanderson, then two days of conference. He'd been running the same training across Microsoft, and it was a good tour of what had quietly turned up in the toolbox.

I came away thinking AI was a curiosity. A useful one, for sure. But I was wrong about what it could do, and it took me most of a year to find out how wrong.

## What I learned at NDC

There were more tools than I expected.

**Embeddings.** Search by meaning instead of by matching words. Think of a library that shelves books by what they're about rather than by title, so a book on "staff turnover" sits next to one on "why people quit". Ask for one and you find the other. It works the other way too: "ship a book" and "book a ship" use exactly the same words, and mean completely different things. Matching words can't tell them apart. Meaning can.

Under the hood, every word or idea becomes a long list of numbers: a point in a space with hundreds of dimensions. Related ideas land close together. Kitten sits near cat, puppy sits near dog, and the step from kitten to cat looks a lot like the step from puppy to dog. How close two points are is how related the ideas are.

**Image scanning.** Hand it a picture and get back what's in it: text, objects, a description.

**Summarising.** Hand it a long document and get back the short version. It was very good at this.

**English as instructions.** Describe what you want, like "swap the first two items with the last two", and it turns that into the steps. For plenty of jobs, describing it was easier than writing the code.

**Tools.** Give the model a set of functions it can call, and it decides when to call them. That's the bit that turns a chatbot into something that can actually do things.

The idea that stuck with me was a ladder. Anything that works through language got easy first, easier than writing the code to do it. Writing code came next. And eventually, strategy: working out which levers to pull. Even then, I figured, it could only reflect information that was already out there.

That wasn't conference hype. I have a lot of respect for Steve, and he gives a great presentation. It sounded plausible, as long as you used the tools within the limits of what they could do. Reading an image and reporting on it was real. Understanding context and meaning through embeddings was real. I came away with three or four genuinely new tools.

What I didn't buy was handing an agent a pile of requests and letting it work things out. Predicting the next token isn't thinking. It only looked intelligent.

## The roll of the dice

Steve also showed us the randomness. Run the same prompt twice and you get two different answers.

Under the hood, a model predicts the next token (roughly, the next word or part of a word) from everything it has seen. It doesn't always take the most likely one. There's some randomness thrown in: a roll of the dice.

He took us further under the hood, too. A chat is just text in a particular shape: special tokens mark where a question starts and where the answer goes, and other tokens let the model ask for a tool to be called. Your code spots those, runs the tool, and feeds the result back in. You can even get more thinking out of a model by dropping "but wait" into the stream, which sends it off down another line of thought.

All of that made sense to me, and it shaped how I thought about it. A model could only give back what it had taken in, with a roll of the dice on top. Remix, yes. Insight, no. Insight was out of the question.

## Free tools and a few fights

In February this year I started playing with AI properly, using the free tools.

ChatGPT was a toy. Gemini was actually quite good.

Claude was a jerk. Sonnet came across like a cocky teenager, sure of itself and keen to tell me so. I got in a few fights with it.

My test question was a practical one: how much lime (OzCal) should I put on my paddocks? The other tools gave me answers. Sonnet told me it was too expensive and a terrible idea.

Fine, maybe. I asked about application rates, and tried to understand the working. Sonnet wouldn't engage. It just kept telling me it was a terrible idea.

So I started looking at the paid versions a bit closer, and that's how I ended up with a model called Opus. I asked it the same question. It agreed OzCal costs more than straight lime, but it told me by how much, and kept working through the problem with me instead of shutting the conversation down.

That wasn't a one-off. Sonnet has been like that on plenty of other occasions too. Opus had everything that first intrigued me about Sonnet, with some maturity behind it. It looks wider, and it doesn't make as many assumptions.

What I didn't know was that I was late to the party. Anthropic had released Opus 4.5 in November 2025, and it was a game changer. I was a few months behind.

## The moment

Around then I'd also seen [a post from David Fowler](https://x.com/davidfowl/status/2012613280133747022) on X. His advice: "If you have not had your opus moment yet", work on a side project that doesn't matter and let AI take the wheel, so you can see what's possible somewhere safe.

Over the next month I fed a few things through Opus. And it gave me genuine insights. Not a summary of what I'd given it. More like: you're looking over there, but this is what you actually need to look at.

One of them was an improvement I'd been asked to deliver. I was going round in circles, listing everything that had been tried before: shared libraries, other ways of reusing the work. None of it had stuck. A shared library needs someone to own it, and without that maturity it churns through versions faster than the teams using it can keep up.

Opus said I didn't need to build a library. The deliverable was solving the problem in one team, in a way the other teams could use directly.

That set me on my arse. I didn't see it coming, and it was exactly the right scope for the problem. That's usually my superpower. I've been described as "specifically non-specific", which is a nice way of saying I describe the problem space without telling people how to solve it. This time, something else drew the boundary better than I had.

That blew my mind. It wasn't what I thought AI could do. In my head, it could only reflect what it had been given. Insight was out of the question.

And yet, here we are.

## What I got wrong

I don't think the NDC version of me was wrong about how it works. It's still next-token prediction, a roll of the dice, and some special tokens to ask for tools. I can walk you through all of it.

And I have no idea how it works.

I know the mechanics, and I can't explain how they add up to "you don't need a library, solve it once in one team". Yet they do.

## Nine months on

Since then, every month has brought new models and different kinds of reasoning. It's getting really interesting.

The scary thing is, on my personal projects I can get agents to write all the code without even reviewing it. Not at work. But at home, it works.

It isn't perfect. Agents don't protect the boundaries. They're happy to generate the same thing in five different spots. An engineer would pull that into one place, behind a boundary, with something that owns it. I'm still searching for a way to fix that. But they're getting better every day.

With Opus 4.5 and 4.8, I'd have said I was still smarter, but it was a great peer. Opus 5.5 knocks me over. I think it's actually smarter than I am. Agents drive better than I do, and they write code better than I do.

I still contribute. I have the best access to the context, and that's valuable.

If you tried AI a while ago and wrote it off as autocomplete with a dice roll, try this: pick a problem you've been stuck on, give a current model the whole picture, and ask it what you're missing. Not for the answer. Ask it where you should be looking.

Or take David Fowler's advice: pick a side project that doesn't matter, and let it take the wheel.
