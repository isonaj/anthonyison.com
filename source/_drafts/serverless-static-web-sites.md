---
title: Serverless static web sites
tags:
---
Serverless seems to be all the rage lately and for good reason. When hosting a web site with rapidly changing traffic, you will either be in a situation where your resources are not being fully utilised (too much cloud) or are failing to meet the demand (not enough cloud). Serverless changes all of that. Instead of paying for hosting, with serverless options you are paying per execution. 

In this post, I'm going to host a static web page in Azure with serverless technologies. Let's go!
First, I need a new application. I'm just going to use the Tour of Heroes tutorial application from here. I'll build that with:

Next, create a V2 Azure storage:

When created, select the storage account, then Static Websites and Enable. Set the index document name to be index.html.

Now, upload the dist folder into the $web container on the new storage.

The web site is now available at https://anthonyisonwebtest.z26.web.core.windows.net. But that's not really good enough, is it? I want a nice name that I can remember, like test.anthonyison.com. So, I set up the custom domain in the storage account like so:

Next, I need an Azure CDN endpoint. Click the Azure CDN link and add a new endpoint. I have selected Verizon Premium to support Force HTTPS redirects later.

Setup a new CNAME entry in your DNS to point from the name you want to the CDN endpoint. In my case, I have a CNAME for test.anthonyison.com to anthonyisontest.azureedge.net. Then, edit the CDN endpoint and add a custom domain.

Edit the custom domain to enable self-managed certificates:

Ok, this step actually took quite a while. I have a CNAME entry set up and so the custom domain should be automatically validated, however I'm over an hour into the wait to get past this step. I've also not received an email which would indicate we're doing a manual validation.
NOTE: If you add a custom domain and then remove it because it's taking too long and then add it again, you get a message saying you have to wait 8 hours after cancelling the last request...