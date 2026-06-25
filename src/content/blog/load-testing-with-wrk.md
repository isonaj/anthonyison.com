---
title: "Load testing with Wrk"
slug: "load-testing-with-wrk"
publishedAt: "2020-12-11T12:51:00.000Z"
updatedAt: "2020-12-15T02:01:51.000Z"
tags:
  - "metrics"
featureImage: "https://images.unsplash.com/photo-1592494850005-0c7e7e8345a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwxMTc3M3wwfDF8c2VhcmNofDIxfHx8ZW58MHx8fA&ixlib=rb-1.2.1&q=80&w=2000"
type: "post"
---

<p>It's funny that this post is about load testing, straight after recommending Locust in my <a href="/load-testing-with-locust/">last post</a>. Sometimes, you need a few different tools in your toolbelt, because they're just better in certain situtations.</p>
<p><a href="https://locust.io">Locust</a> is brilliant for visualising requests per second, latency, unstable throughput, etc. You can change the user count on the fly and adjust according to the data you are seeing.  But what if you're trying to benchmark to compare 2 different, but similar, services?  Then, you really just want a number to compare, and that's where <a href="https://github.com/wg/wrk">Wrk</a> shines.</p>
<h2 id="wrkwork">Wrk... (Work?)</h2>
<p>I'm not sure how to pronounce it, but this one is going to be short and sweet because Wrk is short and sweet!</p>
<p>So, here it is!</p>
<p>I want to run 2 connections, on 1 thread, for 10 seconds.</p>
<blockquote>
<p>In wrk, the connections are spread evenly across the threads. If the threads are not divisble, the connections will be created but will not be used.</p>
</blockquote>
<blockquote>
<p>Don't forget to replace the <code>example.com</code> with the site you want to test!</p>
</blockquote>
<pre><code class="language-bash">$ docker run --rm williamyeh/wrk -t1 -c2 -d10s https://example.com
Unable to find image 'williamyeh/wrk:latest' locally
latest: Pulling from williamyeh/wrk
4fe2ade4980c: Pull complete
c4d7e348633d: Pull complete
3e403d3ebdda: Pull complete
bdb672ee55d9: Pull complete
2bfb714176a4: Pull complete
Digest: sha256:78adc0d9d51a99e6759e702a08d03eaece81c890ffcc9790ef9e5b199d54f091
Status: Downloaded newer image for williamyeh/wrk:latest
Running 10s test @ https://example.com
  1 threads and 2 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   487.42ms  134.71ms   1.10s    87.80%
    Req/Sec     4.38      1.48    10.00     87.50%
  40 requests in 10.02s, 2.81MB read
Requests/sec:      3.99
Transfer/sec:    286.85KB
</code></pre>
<p>Finally, it's an alpine image, so it's only 8 megs!</p>
<p>If you're looking for a single performance figure (requests/sec) on a single endpoint with no effort, wrk will get you there with one command (assuming you have Docker installed, but who hasn't??).</p>
<p>Wrk also has Lua support so you can add extra endpoints and complexity to the requests if you want. Of course, to do that, you need to map volumes to pass script files into the container.  But right now, Wrk does what I need.</p>
