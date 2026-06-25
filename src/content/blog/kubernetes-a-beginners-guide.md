---
title: "Kubernetes: A Beginner's Guide"
slug: "kubernetes-a-beginners-guide"
publishedAt: "2019-06-04T12:45:00.000Z"
updatedAt: "2020-01-11T05:45:47.000Z"
tags:
  - "kubernetes"
featureImage: "__GHOST_URL__/content/images/2020/01/cover-8.jpg"
type: "post"
---

<p>Kubernetes is a container orchestration platform and has been described as &quot;the OS of the cloud&quot;. It builds on container-based services by providing many features such as volumes for stateful services<!-- more -->, resilience and scaling, monitoring, automated zero-downtime upgrades. It runs on a cluster of nodes (VMs) and allocates services to nodes based on either hard limits (eg. my service must run on linux) and prioritised preferences (eg. put these two services on the same VM). If you are running your services in containers, Kubernetes will likely make your life easier.</p>
<h2 id="containers">Containers</h2>
<p>The first important step is to ensure your software is running in a container. A container is a way of packaging your service, along with any dependencies, removing the reliance of specific libraries, etc existing on the OS. I'm mostly assuming you know what a container is, what the benefits are and how to run one in this blog post.</p>
<h2 id="firststeps">First steps</h2>
<p>Assuming you have a container already (and if you haven't you can just use one of mine to follow along), the first step is to create your cluster. Sorry, that part is up to you. Come back here when you're done. You can take a look at <a href="/kubernetes-setting-up-a-cluster-on-aks">this page</a> for assistance with Azure.</p>
<h3 id="pods">Pods</h3>
<p>Pods are the basic building blocks of a Kubernetes system and it's probably fair to say everything else supports Pods in keeping their services running and available. A Pod runs one or more containers and defines ports, volumes, config settings, etc to expose a container service.</p>
<p>To create a pod, you will need a yaml file that defines its structure. If you're not sure what yaml is, it's like a json file with way fewer characters. It uses file layout to express relationships between properties, so take care of those spaces! Anyway, here's our first yaml file:</p>
<pre><code class="language-yaml">---
apiVersion: v1
kind: Pod
metadata:
  name: basiccore-pod
  labels:
    app: basiccore
spec:
  containers:
  - name: basiccore
    image: isonaj/basiccore
    ports:
    - containerPort: 80
  nodeSelector:
    beta.kubernetes.io/os: linux
</code></pre>
<p>Alright, that is not terribly clear because it's got 'basiccore' all over it. This yaml file has 4 parts to it: apiVersion, kind, metadata and spec. We are asking for a <code>Pod</code> kind of component, from <code>v1</code> of the API. The metadata says that the name of the pod should be <code>basiccore-pod</code> and it should have one label called <code>app</code> with the value <code>basiccore</code>. Inside this pod, I want a single container running image <code>isonaj/basiccore</code> (with port <code>80</code> exposed) and the container should be called <code>basiccore</code>. The nodeSelector part is just to ensure that the linux container runs on a Linux node. (with AKS supporting windows nodepools, it helps to be sure)</p>
<p>Now, run that on the cluster using <code>kubectl apply -f pod.yaml</code>. You can check what is happening by running <code>kubectl get pods</code>. If it shows an error, use <code>kubectl describe pod basiccore-pod</code> to find out more.</p>
<p>Once you're finished, there's nothing more to see. We won't actually be using this to go further. Nobody expects the spanish inquision and nobody starts a pod on its own. Delete your pod with <code>kubectl delete pod basiccore-pod</code>.</p>
<h3 id="deployments">Deployments</h3>
<p>So let's start over. Nobody starts a pod by itself, because there's a much better construct for running pods and that is a Deployment. A deployment will provide zero downtime by managing all sorts of things for you. It can be used to automatically rollout new image versions or pod configs (basically anything that could put your uptime at risk). We'll take a closer look in a later post.</p>
<p>Let's jump into the yaml:</p>
<pre><code class="language-yaml">---
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: basiccore-deployment
spec:
  replicas: 2
  template:
    metadata:
      name: basiccore-pod
      labels:
        app: basiccore
    spec:
      containers:
      - name: basiccore
        image: isonaj/basiccore
        ports:
        - containerPort: 80
      nodeSelector:
        beta.kubernetes.io/os: linux
</code></pre>
<p>It's a bit bigger than the Pod yaml. Let's work through from the top. Deployments weren't available in v1. It was added in <code>extensions/v1beta1</code>. Next, we're creating a <code>Deployment</code>, not a <code>Pod</code> and giving it a name of <code>basiccore-deployment</code>. The <code>spec</code> for a deployment consists of the number of replicas and the template. We are starting 2 Pods with this one and the template is the yaml we used to create the Pod earlier.</p>
<p>Let's take a look:</p>
<pre><code class="language-bash">$ kubectl get deployments
NAME                   READY   UP-TO-DATE   AVAILABLE   AGE
basiccore-deployment   2/2     2            2           33s

$ kubectl get pods
NAME                                   READY   STATUS             RESTARTS   AGE
basiccore-deployment-c46759d6d-5qw96   1/1     Running            0          7s
basiccore-deployment-c46759d6d-f94lk   1/1     Running            0          7s
</code></pre>
<h3 id="services">Services</h3>
<p>We've just spent all of this time starting and stopping pods, but we haven't actually connected to it yet. We need a way to get in, and get directed to the pod. For this, we use a Service component.</p>
<blockquote>
<p>A Kubernetes Service is an abstraction layer which defines a logical set of Pods and enables external traffic exposure, load balancing and service discovery for those Pods. - kubernetes.io</p>
</blockquote>
<p>What's that mean? A service component is basically a load balancer that sits across some pods and directs the incoming requests where they are supposed to go.</p>
<pre><code class="language-yaml">---
apiVersion: v1
kind: Service
metadata:
  name: basiccore-service
spec:
  type: LoadBalancer
  selector:
    app: basiccore
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
</code></pre>
<p>This service will open up a port in our cluster and load balance any traffic across the pods in the selector. In this case, we're creating a service with a <code>type</code> of <code>LoadBalancer</code> targetting any pod with the metadata <code>app</code> of <code>basiccore</code> (which we applied in the deployment template).</p>
<p>Run <code>kubectl apply -f basiccore-service.yaml</code> to apply the service and then <code>kubectl get services</code> to see the current state.</p>
<pre><code class="language-bash">$ kubectl get services
NAME                TYPE           CLUSTER-IP   EXTERNAL-IP   PORT(S)        AGE
basiccore-service   LoadBalancer   10.0.55.65   &lt;pending&gt;     80:30376/TCP   5m52s

$ kubectl get services
NAME                TYPE           CLUSTER-IP   EXTERNAL-IP    PORT(S)        AGE
basiccore-service   LoadBalancer   10.0.55.65   13.75.220.78   80:30376/TCP   8m12s
</code></pre>
<p>Once the External IP is displayed, put that into your browser, and there it is. A container, in a pod, accessible from the outside world.</p>
