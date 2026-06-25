---
title: "Ghost on Digital Ocean with Docker"
slug: "ghost-on-digital-ocean-with-docker"
publishedAt: "2020-09-22T12:10:47.000Z"
updatedAt: "2020-09-22T12:10:47.000Z"
tags:
  - "blogging"
  - "containers"
  - "digitalocean"
  - "docker"
  - "ghost"
featureImage: "https://images.unsplash.com/photo-1506606352681-649023fac596?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=2000&fit=max&ixid=eyJhcHBfaWQiOjExNzczfQ"
type: "post"
---

<p>Throughout my blogging experience, I've had access to Azure credits and so I've leaned heavily to Azure solutions. I've recently found myself with no such benefit, which has really levelled the playing field. While I've heard of Digital Ocean (and even had an account), I haven't really taken the leap, until now!</p>
<p>I had the rude experience of having my blog unavailable over a weekend, while away on holiday. I was asked how I had such beautiful error messages (thank you <a href="https://www.cloudflare.com/">Cloudflare</a>!), but I was left looking for cheap hosting with short notice. I tried Azure first, but the smallest VM was more expensive than others and had a really slow disk. AWS Lightsail was another avenue to consider. GCP also provide good, low-cost compute. I found a few recommendations for <a href="https://www.digitalocean.com/">Digital Ocean</a>, and that's where I ended up!</p>
<blockquote>
<p>One thing I love about Digital Ocean is you can get a 1 core, 1 Gb RAM VM for $5/month (legit!) and they also have managed Kubernetes solutions from $10/node.</p>
</blockquote>
<h2 id="1createavm">1. Create a VM</h2>
<p>Creating a VM is super simple!</p>
<ol>
<li>Select Droplets and click Create.</li>
<li>Select Ubuntu, Basic and $5/month.</li>
<li>Select a Datacenter location. (You might want this near your users if not using CDN)</li>
<li>Generate an SSH Key. (their documentation is great for this!)</li>
<li>Choose a Hostname.</li>
<li>Click Create Droplet.</li>
</ol>
<h2 id="2sshtothevm">2. SSH to the VM</h2>
<p>You will need to ssh to the machine. I had a little trouble with this because I kept forgetting to use 'root' when connecting. Don't do that.</p>
<pre><code class="language-bash">$ ssh root@&lt;ip&gt;
</code></pre>
<h2 id="3installnginxanddocker">3. Install Nginx and Docker</h2>
<p>We are going to run Ghost in a container and we want Nginx to handle HTTPS for us. Let's go ahead and install Docker and Nginx. (This is the step that really highlights a slow disk!)</p>
<pre><code class="language-bash">$ sudo apt install nginx
$ curl -sL https://get.docker.com | sh
</code></pre>
<h2 id="4setupfirewall">4. Setup firewall</h2>
<p>No one ever got fired for too much security. You COULD enable a cloud based firewall. (most providers have this easily accessible) It never hurts to enable it on the VM too though, right? I'm using UFW (Uncomplicated Firewall). I open up Nginx so that we can use the Nginx config to choose the ports we use. It leaves fewer moving parts.</p>
<pre><code class="language-bash">$ ufw default deny incoming
$ ufw default allow outgoing
$ ufw allow ssh
$ ufw allow 'Nginx Full'
$ ufw enable

$ ufw status
Status: active

To                         Action      From
--                         ------      ----
22/tcp                     ALLOW       Anywhere
Nginx Full                 ALLOW       Anywhere
22/tcp (v6)                ALLOW       Anywhere (v6)
Nginx Full (v6)            ALLOW       Anywhere (v6)
</code></pre>
<h2 id="5runghost">5. Run Ghost</h2>
<p>Next, let's run Ghost! It runs on port 2368, which we want to port map to the localhost (<code>-p 2368:2368</code>). Next, we map the localhost volume (<code>/var/www/anthonyison.com/content</code>) to the ghost content folder in the container.  Without this, the content would be lost whenever the container restarts. The <code>--restart-always</code> parameter will restart that container, even after a reboot.</p>
<pre><code class="language-bash">$ docker run -p 2368:2368 \
    -e url=https://anthonyison.com \
    -v /var/www/anthonyison.com/content:/var/lib/ghost/content \
    --restart=always -d ghost:3.33.0-alpine 
</code></pre>
<p>You can now use <code>curl 127.0.0.1:2368</code> to test that your Ghost server is running. Technically, we're hosting Ghost, but it's not on port 80/443 and not accessible to the outside world. Let's fix that.</p>
<h2 id="6configurenginx">6. Configure Nginx</h2>
<p>We've installed Nginx, but now we need to configure it to redirect port 80 traffic to our Ghost container. We do that by creating a config file in the <code>sites-available</code> folder for each host.</p>
<blockquote>
<p>Nginx is a great choice for a reverse proxy. Microsoft have recently released <a href="https://microsoft.github.io/reverse-proxy/index.html">YARP</a> (YARP: Another Reverse Proxy) based on dotnet core. In a future post, I hope to run some performance tests to compare YARP and Nginx.</p>
</blockquote>
<p>Create file <code>/etc/nginx/sites-available/anthonyison.com</code> with these contents:</p>
<pre><code class="language-json">server {
	listen 80;
	server_name anthonyison.com www.anthonyison.com;
	location /.well-known/ {
		root /var/www/anthonyison.com/.well-known/;
	}

	location / {
        proxy_pass	http://127.0.0.1:2368;
	    proxy_set_header    X-Real-IP $remote_addr;
	    proxy_set_header    Host      $http_host;
		proxy_set_header X-Forwarded-Proto https;
	    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
</code></pre>
<p>Then enable this by making a soft link to the <code>sites-enabled</code> folder with:</p>
<pre><code class="language-bash">$ ln -s /etc/nginx/sites-available/anthonyison.com /etc/nginx/sites-enabled/anthonyison.com
$ sudo systemctl reload nginx
</code></pre>
<p>Test with <code>curl localhost -H &quot;Host: anthonyison.com&quot;</code>.</p>
<h2 id="7installandconfigurecertbot">7. Install and Configure Certbot</h2>
<p>To manage HTTPS, we want to use <a href="https://letsencrypt.org/">LetsEncrypt</a> to get our certificates for free. There's no such thing as a free lunch, though. LetsEncrypt certificates only last 3 months to encourage people to set up scripts to automate the process.</p>
<p>LetsEncrypt with Nginx can be problematic. It's usually a three-step process, first to set up port 80 with the .well-known path then fetching certificates then configuring SSL with the certificates. After that, you need to work out how to regenerate the certificates every 3 months.</p>
<p>Certbot changes all of that. Once HTTP is working, Certbot will fetch the certificates, update the Nginx config and set up a cron job to renew the certificates as required. Brilliant!</p>
<pre><code class="language-bash">$ apt install certbot python3-certbot-nginx
$ certbot --nginx -d anthonyison.com -d www.anthonyison.com

Please choose whether or not to redirect HTTP traffic to HTTPS, removing HTTP access.
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
1: No redirect - Make no further changes to the webserver configuration.
2: Redirect - Make all requests redirect to secure HTTPS access. Choose this for
new sites, or if you're confident your site works on HTTPS. You can undo this
change by editing your web server's configuration.
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Select the appropriate number [1-2] then [enter] (press 'c' to cancel):
</code></pre>
<p>Select Option 2, to update the config to force HTTPS. This will update the Nginx config to force HTTP to HTTPS and Certbot will also set up the certificates. Certbot will also set up a timer to update the certificate automatically for you. Check the service with <code>sudo systemctl status certbot.timer</code> to see when it will check next. To test the renewal process, run <code>sudo certbot renew --dry-run</code>.</p>
<p>Don't forget to refresh Nginx to activate the new config.</p>
<pre><code class="language-bash">$ systemctl reload nginx
</code></pre>
<h2 id="8profit">8. Profit!</h2>
<p>That's it! Setup your DNS to point to the IP of your VM and you're good to go. GO ahead and hit the endpoint to confirm. Create a user if this is your first Ghost server.</p>
<h2 id="backingup">Backing up</h2>
<p>Ghost provides the ability to export your posts, but that won't include any images or themes you've installed.</p>
<p>The best way I know to backup your content is to use SCP. To backup the content folder to a local <code>backup</code> folder, you would do this:</p>
<pre><code class="language-bash">$ scp root:&lt;ip&gt;:/var/www/anthonyison.com/content backup
</code></pre>
<p>Enjoy!</p>
<p>Big thanks to the following for their help migrating to Digital Ocean:</p>
<ul>
<li><a href="https://blog.alexellis.io/your-ghost-blog/">Alex Ellis - Run your blog with Ghost, Docker and LetsEncrypt</a></li>
<li><a href="https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-20-04">Digital Ocean - Install Ubuntu</a></li>
<li><a href="https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-20-04">Digital Ocean - How to Secure Nginx with LetsEncrypt</a></li>
</ul>
