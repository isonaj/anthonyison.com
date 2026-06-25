---
title: "Kubernetes: AKS and Windows Containers"
slug: "kubernetes-aks-and-windows-containers"
publishedAt: "2019-06-10T04:52:00.000Z"
updatedAt: "2020-01-11T05:56:50.000Z"
tags:
  - "aks"
  - "azure"
  - "kubernetes"
featureImage: "__GHOST_URL__/content/images/2020/01/cover-9.jpg"
type: "post"
---

<p>When I first heard about Windows containers, I got really excited by the idea of packaging ASP.Net legacy apps and ASP.Net Core apps consistently, without the need to remote into a VM and apply extra libraries.<!-- more --> I soon found that Windows containers were quickly followed by a &quot;yeah, but&quot;. Windows node support has recently been added to Kubernetes and AKS. I don't think it's quite ready for production, but it sure does look promising.</p>
<h2 id="whyusewindowscontainers">Why use Windows Containers?</h2>
<p>Firstly, we need to realise that Windows ain't Windows. There are 2 types of windows containers:</p>
<ul>
<li>Windows Server Core</li>
<li>Nano Server</li>
</ul>
<h3 id="windowsservercore">Windows Server Core</h3>
<p>Windows Server Core is mostly your standard Windows Server. If you're running .Net Framework services, you're looking here. Unfortunately, the containers are HUGE! (<s>12 gig</s> 5 gig for a container)  That said, it's come a long way in the last few years. Overall, I like Windows Server Core because it allows legacy .Net Framework applications to be packaged and deployed in modern ways and these are the applications that usually really need it.</p>
<h3 id="nanoserver">Nano Server</h3>
<p>Nano Server solves the bloat problem with the Windows containers, coming in at a more respectable 300-ish megs, which is really exciting! &quot;Yeah, but&quot; it doesn't support .Net framework. SO it's pretty much for .Net Core projects. The problem with this is .Net Core projects really SHOULD target Linux instead. There are use cases for Nano Server, such as combining .Net Framework and .Net Core projects together on a single windows server. So, if you absolutely MUST run on Windows, Nano server has your back, though I would consider this a last resort option.</p>
<h2 id="theproblemwithwindowscontainers">The problem with Windows containers</h2>
<p>I've already said that I don't think Windows containers are quite ready for production. This is mostly due to <a href="https://docs.microsoft.com/en-us/virtualization/windowscontainers/deploy-containers/version-compatibility">Windows container compatibility</a>. Without Hyper-V, which is not yet supported in Kubernetes, a windows container will only run on a matching host OS version. This means your host OS and container OS needs to be matched (which isn't too bad, I guess), but it also means they should be upgraded at the same time. ie. Upgrade the Windows OS on your nodes and watch your current services fail to start.</p>
<h2 id="usethemanyway">Use them anyway</h2>
<p>To be honest, I'm inclined to start using Windows containers anyway. Windows Server 2019 is out. Hyper-V is coming to Kubernetes. I'm expecting Microsoft to have a migration path available soon. Realistically, it will be a while before the Host OS is upgrading and I'm expecting these issues to be solved by then. Either way, I think it's close enough that I'm prepared to look a lot closer, perhaps even as far as a staging environment.</p>
<h3 id="createaclusterinaks">Create a Cluster in AKS</h3>
<p><em>NOTE:</em> Do the following to enable the preview features required for multiple nodepools.</p>
<pre><code class="language-bash">$ az extension add --name aks-preview
$ az feature register \
    --name MultiAgentpoolPreview \
    --namespace Microsoft.ContainerService

$ az feature register \
    --name VMSSPreview \
    --namespace Microsoft.ContainerService
</code></pre>
<p>It takes some time to register the features. Check the progress with:</p>
<pre><code class="language-bash">$ az feature list \
    -o table \
    --query &quot;[?contains(name, 'Microsoft.ContainerService/VMSSPreview')].{Name:name,State:properties.state}&quot;
</code></pre>
<p>Create the cluster:<br>
In order to use multiple nodepools, we need to enable VM Scale Sets (VMSS), so make sure you do that whether you create from command line or through portal.</p>
<p>NOTE: Password must be min 12 chars, and have Uppercase, Lowercase, numeric and Special chars</p>
<pre><code class="language-bash">$ az aks create \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --node-count 1 \
    --node-vm-size Standard_B2s \
    --enable-addons monitoring \
    --kubernetes-version 1.14.0 \
    --generate-ssh-keys \
    --windows-admin-password $PASSWORD_WIN \
    --windows-admin-username azureuser \
    --enable-vmss \
    --network-plugin azure
</code></pre>
<h3 id="createwindowsnodepool">Create Windows nodepool</h3>
<p>Next add the Windows node pool with the following:</p>
<pre><code class="language-bash">$ az aks nodepool add \
    --resource-group myResourceGroup \
    --cluster-name myAKSCluster \
    --os-type Windows \
    --name npwin \
    --node-count 1 \
    --node-vm-size Standard_B2s \
    --kubernetes-version 1.14.0
</code></pre>
<h3 id="windowspods">Windows Pods</h3>
<p>I'm assuming you have connected your cluster to your kubectl, so now let's create a Pod. Of course, normally you would create a pod with a Deployment object, but we're just testing things out.</p>
<pre><code class="language-yaml">---
apiVersion: v1
kind: Pod
metadata:
  name: basiccorewin-pod
  labels:
    app: basiccorewin
spec:
  containers:
  - name: basiccorewin
    image: isonaj/basiccorewin:1803
    ports:
    - containerPort: 80
  nodeSelector:
    beta.kubernetes.io/os: windows
</code></pre>
<h3 id="mywindowspodwontstart">My Windows Pod won't start</h3>
<p>The Windows pod has been created and applied, but it won't start correctly. Instead, <code>kubectl get pods</code> is showing the pod in a RunContainerError state. Have a closer look by running <code>kubectl describe pod &lt;podName&gt;</code>. You're looking for 'Failed to start container' and the error message following. If it is 'The container operating system does not match the host operating system' then you have a Host OS/Container OS version mismatch.</p>
<blockquote>
<p>The container operating system does not match the host operating system.</p>
</blockquote>
<p>So, I ran <code>kubectl describe node &lt;nodepool&gt;</code> and saw that my host OS is 10.0.17763.379 (which is 1809). For the container, run <code>docker inspect isonaj/basiccorewin:1803</code> and look for OsVersion. This shows my container OS version to be 10.0.17134.766 (which is version 1803). To resolve this situation, I built a new container with an OS that matches the host I want to run on. (1809)</p>
<h3 id="nodetaints">Node Taints</h3>
<p>Before I finish up, I should really point out Node Taints. Any way you slice it, Kubernetes really expects to be running Linux under the hood and it's not possible to update ALL of the deployment yamls to specify the os-type. So how do we wrangle this split os-type monster?</p>
<p>Taints are built for this purpose. The idea is that we tell Kubernetes not to run pods on the windows nodepool, unless we explicitly permit it.</p>
<pre><code class="language-bash">$ kubectl get nodes
NAME                                STATUS   ROLES   AGE     VERSION
aks-nodepool1-16426533-vmss000000   Ready    agent   3h16m   v1.14.0
akswin000000                        Ready    agent   3h5m    v1.14.0

$ kubectl taint node akswin000000 sku=win:NoSchedule
node/akswin000000 tainted
</code></pre>
<p>And done. Now if you want to run a Pod on the windows node, you need to apply a Toleration to the node, like so:</p>
<pre><code class="language-yaml">---
apiVersion: v1
kind: Pod
metadata:
  name: basiccorewin-pod
  labels:
    app: basiccorewin
spec:
  containers:
  - name: basiccorewin
    image: isonaj/basiccorewin
    ports:
    - containerPort: 80
  nodeSelector:
    beta.kubernetes.io/os: windows
  tolerations:
  - key: &quot;sku&quot;
    operator: &quot;Equal&quot;
    value: &quot;win&quot;
    effect: &quot;NoSchedule&quot;
</code></pre>
<h2 id="summary">Summary</h2>
<p>I don't think Windows containers are quite production ready, but I think they're getting pretty close to what I need. If you can match the container versions to the version of the host they will be deployed to, they seem to run quite happily. I think it's worth getting used to putting .Net Framework applications into containers and even hosting in staging. I don't think it will be long before they're ready for production.</p>
