---
title: How to Make Angular Prettier
tags:
image:
feature_img:
description:
keywords:
---
THis post would be about setting up Prettier to format code on save.

Why Prettier?
A lot of effort goes into debates on coding styles. Prettier takes it all off the table. It's very opinionated, but it's easier to let it solve most of your problems.

A lot of code is changed and changed back manually, but different developers. It's wasteful and meaningless work, "busy work".


## Installing Prettier
$ npm i prettier -D

## Format On Save in VS Code
settings.json
editor.formatOnSave: true

Suggest to install the Extension

## Trigger on Pre-Commit Hook
$ npm i husky -D


## What's wrong with it?
Well, probably plenty. After all, coding standards are full of opinions.
The one that really sticks out for me is the hanging > in HTML code.