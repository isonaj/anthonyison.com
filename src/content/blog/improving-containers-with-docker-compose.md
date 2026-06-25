---
title: "Improving Containers with Docker Compose"
slug: "improving-containers-with-docker-compose"
publishedAt: "2020-09-29T11:28:57.000Z"
updatedAt: "2020-09-29T11:28:57.000Z"
tags:
  - "containers"
  - "docker"
  - "ghost"
featureImage: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=2000&fit=max&ixid=eyJhcHBfaWQiOjExNzczfQ"
type: "post"
---

<p>In my <a href="/ghost-on-digital-ocean-with-docker/">last post</a>, I walked through how to run Ghost in a container on a really cheap VM with Digital Ocean. It's a great start, but while I have reproducibility in the container, I can't be sure that I supplied the correct parameters when I run the container. That is, <code>docker run -e url=&lt;host&gt; -p &lt;dest:src&gt; -v &lt;dest:src&gt; --restart=always ghost:3.33.0-alpine</code>. What if I need to restart? Can I be sure I did it exactly the same each time? Sure, I could create a simple bash script to start the container, but there's a better solution.</p>
<p><a href="https://docs.docker.com/compose/">Docker Compose</a> is a tool for defining and running multi-container Docker applications. With Compose, you use a YAML file to configure your application's services. In essence, you use a single YAML file that describes multiple services and start and stop these services with a single command. Furthermore, we have the config file available in case we need to make any tweaks later on.</p>
<p>So let's get into it.</p>
<h2 id="installdockercompose">Install Docker Compose</h2>
<p>Installing Docker Compose is super simple. Just run:</p>
<pre><code class="language-bash">$ apt install docker-compose
</code></pre>
<p>This will go ahead and grab Docker Compose along with any dependencies. It won't be the latest version, but I don't care much about that.</p>
<h2 id="configuredockercompose">Configure Docker Compose</h2>
<p>Configuring the container is simple (in as much as any YAML config file is simple). Hey, I don't mind them, but I know a lot of people who seem to think YAML destroyed the internet.</p>
<p>Create the file <code>/var/www/anthonyison.com/docker-compose.yaml</code> with the following contents:</p>
<pre><code class="language-yaml">version: &quot;3.1&quot;

services:
  ghost:
    container_name: ghost
    image: ghost:3-alpine
    restart: always
    ports:
      - 2368:2368
    environment:
      - NODE_ENV=production
      - url=https://anthonyison.com
    volumes:
      - ./content:/var/lib/ghost/content
</code></pre>
<p>The content folder should be immediately off this folder. The <code>content</code> folder will be mapped to the <code>/var/lib/ghost/content</code> folder when the container is started. The config file also sets up the url, ports, image, container name, etc.</p>
<p>If we wanted to step things up, we could also start a MySQL container and set the config for Ghost to use MySQL instead of SQLite as the database. I don't care to do that for now.</p>
<p>We can now start the Ghost container like so:</p>
<pre><code class="language-bash">$ cd /var/www/anthonyison.com
$ docker-compose up -d
</code></pre>
<p>To shut down all of the containers started by Docker Compose, we could then run:</p>
<pre><code class="language-bash">$ docker-compose down
</code></pre>
<h2 id="conclusion">Conclusion</h2>
<p>We now have a configuration file for the parameters required to run our Ghost container for the blog. This reduces the complexity (or at least makes it more reproducible) since the container can be started with a simple <code>docker-compose up</code> command.</p>
<p>As we've discovered in this post, Docker Compose helps to simplify the startup and basic orchestration of containers. Kubernetes would take this to a whole new level, but I can't fit a Kubernetes cluster into my limited budget just yet. For now, Docker Compose will fit the bill while keeping my running costs right down.</p>
