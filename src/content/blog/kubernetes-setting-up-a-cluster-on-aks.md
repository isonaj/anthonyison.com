---
title: "Kubernetes: Setting up a cluster on AKS"
slug: "kubernetes-setting-up-a-cluster-on-aks"
publishedAt: "2019-06-04T12:45:00.000Z"
updatedAt: "2020-01-11T05:51:41.000Z"
tags:
  - "aks"
  - "azure"
  - "kubernetes"
featureImage: "__GHOST_URL__/content/images/2020/01/cover_smaller.jpg"
type: "post"
---

<p>Most cloud providers provide a managed Kubernetes cluster at this point. Each time I come back to look at Kubernetes, I feel like I've forgotten something (or everything). This post is a cheat sheet<!-- more --> for getting a cluster up and running on Azure (using AKS) with recommended extras.</p>
<h2 id="creatingacluster">Creating a Cluster</h2>
<h3 id="gettingready">Getting ready</h3>
<p>Firstly, let's install the latest Azure CLI. Check <a href="https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest">here</a> for the latest version. Run <code>az --version</code> to see what version you have if you have it installed already. Next, <code>az login</code> and <code>az account set -s &lt;subscriptionId&gt;</code> so that you're ready to go.</p>
<p>Create the resource group: (location is important. some areas have no AKS support yet eg. australiasoutheast)</p>
<pre><code class="language-bash">$ az group create --name myResourceGroup --location australiaeast
</code></pre>
<h3 id="createalinuxonlycluster">Create a Linux-only cluster</h3>
<p>Create the AKS cluster:</p>
<pre><code class="language-bash">$az aks create \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --node-count 1 \
    --enable-addons monitoring \
    --generate-ssh-keys
</code></pre>
<h3 id="connectkubectltoyourcluster">Connect kubectl to your cluster</h3>
<p>Install latest kubectl using <code>az aks install-cli</code>. (You may need to update your path to find the correct kubectl.exe)</p>
<pre><code class="language-bash">$ az aks get-credentials --resource-group myResourceGroup --name myAKSCluster
</code></pre>
<p>Connect to the Kubernetes Dashboard:</p>
<pre><code class="language-bash">$ az aks browse --resource-group myResourceGroup --name myAKSCluster
</code></pre>
<p>If you get permissions errors (due to RBAC), you can give cluster-admin permissions with:</p>
<pre><code class="language-bash">$ kubectl create clusterrolebinding kubernetes-dashboard \
    -n kube-system --clusterrole=cluster-admin \
    --serviceaccount=kube-system:kubernetes-dashboard
</code></pre>
