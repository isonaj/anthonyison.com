---
title: 'Containers: Thinking inside the box'
tags:
image:
feature_img:
description:
keywords:
---
In the [previous post](/containers-a-beginner-s-guide), we looked at running existing container images and building new images. The problem is that building an image can take some time, not a lot, but enough. During development, you usually want fast iterations and many tools now support a "watch" feature that only compiles the changes. Make a change. See the result. Make a change. See the result. Developing on containers feels really sluggish if you do a full rebuild after each change, so how can you take advantage of containers during development?