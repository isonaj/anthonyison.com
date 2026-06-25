---
title: "Ghost on a Shoestring"
slug: "ghost-on-a-shoestring"
publishedAt: "2020-05-20T11:55:31.000Z"
updatedAt: "2020-05-20T11:55:31.000Z"
tags:
  - "ghost"
featureImage: "https://images.unsplash.com/photo-1459257831348-f0cdd359235f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=2000&fit=max&ixid=eyJhcHBfaWQiOjExNzczfQ"
type: "post"
---

<p>I started out this blog wanting to host Ghost in a container running on an Azure Web App. When I had errors creating the database, I tried Kubernetes and it just worked so I found myself running Ghost in AKS.</p>
<p>This has been a great experience overall, however I've lost my blog a few times by exceeding my available credits, mostly due to unexpected running costs. It's been difficult to predict my spending costs since the environment has a virtual machine, disk, router and logging that all contribute significantly to the total cost. I also found that Kubernetes had a limit of 4 disks per node, which was the limiting factor to the number of ghost servers I could run. The problem is, I have too much power and it costs too much. The smallest single node AKS cluster seems to cost around $3-$4/day. When I can have a hosted Wordpress site for $5/mth, it's just too much.</p>
<p>Web Apps have a single price for the App Service Plan, plus any Azure Storage, which would be perfect for any extra content, like images, etc. I hit too many problems trying to run a sqlite database on a volume mapped to Azure Storage.</p>
<p>Or we could just spin up a Linux VM and follow the <a href="https://ghost.org/docs/install/ubuntu/">instructions from Ghost</a>. We really don't need much resources, so I'm going to use a B1ms (1 core, 2 Gb RAM).</p>
<h2 id="1createthelinuxvm">1. Create the Linux VM</h2>
<p>The Azure Cli makes this super simple.</p>
<pre><code class="language-bash">$ az group create \
    --name blogs \
    --location australiaeast

$ az vm create \
    --resource-group blogs \
    --name blogs \
    --image UbuntuLTS \
    --admin-username azureuser \
    --generate-ssh-keys \
    --size Standard_B1ms

$ az vm open-port \
    --port 80 \
    --resource-group blogs \
    --name blogs \
    --priority 900
    
$ az vm open-port \
    --port 443 
    --resource-group blogs 
    --name blogs 
    --priority 910
</code></pre>
<h2 id="2connectandupdateyourvm">2. Connect and update your VM</h2>
<p>You've got a pretty barebones image right now. The next step is to connect and upgrade anything installed. You will need the IP that was supplied when you created the VM, or you can look it up in the Azure Portal.</p>
<pre><code class="language-bash">$ ssh azureuser@&lt;ip&gt;
$ sudo apt-get update
$ sudo apt-get upgrade
</code></pre>
<h2 id="3installnode">3. Install Node</h2>
<pre><code class="language-bash">$ curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
$ sudo apt-get install nodejs
</code></pre>
<h2 id="4installmysql">4. Install MySQL</h2>
<pre><code class="language-bash">$ sudo apt-get install mysql-server

$ sudo mysql

# Now update your user with this password
# Replace 'password' with your password, but keep the quote marks!
&gt; ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';

# Then exit MySQL
&gt; quit
</code></pre>
<h2 id="5installnginx">5. Install Nginx</h2>
<pre><code class="language-bash">$ sudo apt-get install nginx

$ sudo ufw allow 80/tcp
$ sudo ufw allow 443/tcp
</code></pre>
<h2 id="6installghostandcreateblog">6. Install Ghost and Create Blog</h2>
<pre><code class="language-bash">$ sudo npm install ghost-cli@latest -g
$ sudo mkdir -p /var/www/ghost/
$ sudo sudo chown azureuser:azureuser /var/www/ghost
$ sudo chmod 775 /var/www/ghost

$ cd /var/www/ghost/
$ ghost install
</code></pre>
<h2 id="summary">Summary</h2>
<p>This is a pretty barebones install and requires quite a lot of steps to bring it together. I like the cost and this has been good to get started. To improve things, I'd like to have mysql and ghost running from containers. This would move the complexity from setting up ghost to setting up docker. We could then use docker-compose to pull images and start the services.</p>
