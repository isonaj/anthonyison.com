---
title: "Running Ghost on Kubernetes on Azure"
slug: "running-ghost-on-kubernetes-on-azure"
publishedAt: "2019-01-16T05:16:00.000Z"
updatedAt: "2020-01-11T05:18:31.000Z"
tags:
  - "azure"
  - "ghost"
  - "kubernetes"
featureImage: "__GHOST_URL__/content/images/2020/01/cover.png"
type: "post"
---

<p>In my <a href="/creating-a-blog-with-ghost/">previous post</a>, I was looking into a few options for running my blog. I think at this time, I'm going to keep it on Azure because I can run it for free.<!-- more --> I suspect I would make a different choice if not for my bonus credits. I will need some benchmark figures to choose a provider, however kubernetes should give me the platform I need to change in the future if necessary.</p>
<p>I have a basic level of understanding of how kubernetes hangs together and would love to hear your feedback if you would do things differently. The basic idea is to run a ghost container and provide persistent storage for the content. In the future, I would like to use nginx to reverse proxy incoming traffic and to provide HTTPS for my site.</p>
<p>I have used AKS to generate a kubernetes cluster and my kubectl is configured to connect to it. First, I need to configure my storage. For this, I use a yaml file.</p>
<pre><code class="language-yaml">apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: anthonyison-content
spec:
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 5Gi
  storageClassName: default
</code></pre>
<p>Using <code>kubectl apply -f volume.yaml</code> we can generate the volume claim to be used in the next step. Next, we will generate a deployment for the the ghost container, linking it to the anthonyison-content volume.</p>
<pre><code class="language-yaml">apiVersion: apps/v1beta1
kind: Deployment
metadata:
  name: anthonyison
  labels:
    app: anthonyison
spec:
  replicas: 1
  selector:
    matchLabels:
      app: anthonyison
  template:
    metadata:
      labels:
        app: anthonyison
    spec:
      containers:
      - name: anthonyison
        image: ghost:2.9.1-alpine
        imagePullPolicy: Always
        ports:
        - containerPort: 2368
        env:
        - name: url
          value: http://anthonyison.com
        volumeMounts:
        - mountPath: /var/lib/ghost/content
          name: content
      volumes:
      - name: content
        persistentVolumeClaim:
          claimName: anthonyison-content
</code></pre>
<p>So now we have a ghost container running in Kubernetes with an external mounted volume for storing content. However, it's not exposed as yet. We do that with a Service. The <code>service.yaml</code> is below.</p>
<pre><code class="language-yaml">apiVersion: v1
kind: Service
metadata:
  name: anthonyison
spec:
  type: LoadBalancer
  selector:
    app: anthonyison
  ports:
  - protocol: TCP
    port: 80
    targetPort: 2368
</code></pre>
<p>And that's actually all there is to it. By running <code>kubectl get services</code> you can see the External IP. If you put that in the browser, you will go to the new blog. Better still, put the IP into your DNS A record, and your domain name will direct to the new site.</p>
