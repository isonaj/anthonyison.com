---
title: "Manually Create a Kubernetes Cluster with Kubeadm"
slug: "manually-create-a-kubernetes-cluster-with-kubeadm"
publishedAt: "2020-10-05T12:07:19.000Z"
updatedAt: "2020-10-26T03:30:08.000Z"
tags:
  - "kubernetes"
featureImage: "https://images.unsplash.com/photo-1579702493520-6db186849e38?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=2000&fit=max&ixid=eyJhcHBfaWQiOjExNzczfQ"
type: "post"
---

<p>These days, I would recommend using a managed Kubernetes over something you've manually created, especially for production workloads. That said, there's something exciting about working with the nuts and bolts of a Kubernetes cluster.</p>
<p>We are going to use KubeADM to create a cluster from some co-located virtual machines.</p>
<blockquote>
<p>Kubeadm is an open source utility for bootstrapping a Kubernetes cluster.</p>
</blockquote>
<h2 id="createsomevms">Create some VMs</h2>
<p>We will create a couple of VMs (Ubuntu 20 in this case) where one will be the master node and the other will be a worker. I've used a minimum size of 2 CPU and 4 Gb memory for each, on the same network and enabled SSH access to each. I called the master and worker-01 respectively. This is left as an exercise for the reader.  :)</p>
<p>When creating a new VM, it is always recommended to update the image OS.</p>
<pre><code class="language-bash">$ apt-get update &amp;&amp; apt-get upgrade
</code></pre>
<h2 id="setupamasternode">Set up a master node</h2>
<p>The master node is the heart of the cluster. Kubeadm is capable of creating a highly-available (HA) master and/or a HA etcd database. For this cluster, we will be creating a single master node.</p>
<h3 id="installdocker">Install Docker</h3>
<p>While there are a few options for the container runtime (eg. Docker, CRI-O and rkt), Docker is still the most common and is what we'll be using here. Let's get it installed and started.</p>
<pre><code class="language-bash">$ apt-get install -y docker.io
$ systemctl enable docker.service
</code></pre>
<h3 id="installkubeadmkubeletandkubectl">Install kubeadm, kubelet and kubectl</h3>
<p>Obviously, to use kubeadm to create the customer, we need to install Kubeadm! While we're here, we also need to install kubelet, which is responsible for starting and stopping containers as required. Kubectl, as we've seen in other posts, is the client for communicating directly with the API Server, the brains of the cluster. These installation instructions involve pulling the Kubernetes package list from Google and then installing.</p>
<pre><code class="language-bash">$ sudo apt-get update &amp;&amp; sudo apt-get install -y apt-transport-https curl
$ curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -
$ cat &lt;&lt;EOF | sudo tee /etc/apt/sources.list.d/kubernetes.list
&gt; deb https://apt.kubernetes.io/ kubernetes-xenial main
&gt; EOF
$ sudo apt-get update
$ sudo apt-get install -y kubelet kubeadm kubectl
$ sudo apt-mark hold kubelet kubeadm kubectl
</code></pre>
<h3 id="configureapodnetwork">Configure a Pod Network</h3>
<p>Kubernetes networking aims to provide a unique IP to each Pod in order to allow easy service discovery and support Pod to Pod communication. There are a few options for providing this networking support.</p>
<ol>
<li>Calico</li>
<li>Weave Net</li>
<li>Flannel</li>
<li>kube-router</li>
<li>Romana</li>
<li>Azure CNI (used by AKS)</li>
</ol>
<p>In this blog, we'll install Calico:</p>
<pre><code class="language-bashbash">$ wget https://docs.projectcalico.org/manifests/calico.yaml
$ less calico.yaml
</code></pre>
<p>Find the section that says (it's near the EOF):</p>
<pre><code># The default IPv4 pool to create on startup if none exists. Pod IPs will be
# chosen from this range. Changing this value after installation will have
# no effect. This should fall within `--cluster-cidr`.
# - name: CALICO_IPV4POOL_CIDR
#   value: &quot;192.168.0.0/16&quot;
</code></pre>
<p>This is the default IP range that will be used by Calico within the provided network. If you plan to use this range, we will push that into kubeadm next. If you want a different range, update the yaml file now.</p>
<h3 id="configurethemasternode">Configure the master node</h3>
<p>We're almost ready to hit the go button. So let's get started creating a basic cluster configuration file.</p>
<p>First, we want a name to provide access to this master node. Find the local IP with: (you're looking for the IP of this VM on your local network)</p>
<pre><code class="language-bashbashbash">$ ip addr show
3: eth1: &lt;BROADCAST,MULTICAST,UP,LOWER_UP&gt; mtu 1500 qdisc fq_codel state UP group default qlen 1000
    link/ether 7e:58:53:31:a2:3d brd ff:ff:ff:ff:ff:ff
    inet 10.104.16.2/20 brd 10.104.31.255 scope global eth1
       valid_lft forever preferred_lft forever
    inet6 fe80::7c58:53ff:fe31:a23d/64 scope link
       valid_lft forever preferred_lft forever
</code></pre>
<p>Edit <code>/etc/hosts</code> and add a record for the local network IP.</p>
<pre><code>127.0.0.1 localhost
10.104.16.2 k8smaster  #&lt;-- add this row
</code></pre>
<p>Create the config file, <code>kubeadm-config.yaml</code>:</p>
<pre><code class="language-yaml">apiVersion: kubeadm.k8s.io/v1beta2
kind: ClusterConfiguration
kubernetesVersion: 1.18.1
controlPlaneEndpoint:&quot;k8smaster:6443&quot;
networking:
  podSubnet: 192.168.0.0/16
</code></pre>
<p>The podSubnet value needs to match the pod network IP range from the previous step.</p>
<h3 id="initialisethemasternode">Initialise the master node</h3>
<p>With the cluster config file, we are now ready to start up our master node. This command will generate some keys that will be active for 2 hours. That's plenty long enough to get your worker's joined up, but make things more complicated if you plan to add and remove workers later.</p>
<pre><code class="language-bash">$ kubeadm init --config=kubeadm-config.yaml --upload-certs \
  | tee kubeadm-init.out
  
W1005 05:47:50.754254   31387 configset.go:348] WARNING: kubeadm cannot validate component configs for API groups [kubelet.config.k8s.io kubeproxy.config.k8s.io]
[init] Using Kubernetes version: v1.19.2
[preflight] Running pre-flight checks
        [WARNING IsDockerSystemdCheck]: detected &quot;cgroupfs&quot; as the Docker cgroup driver. The recommended driver is &quot;systemd&quot;. Please follow the guide at https://kubernetes.io/docs/setup/cri/
[preflight] Pulling images required for setting up a Kubernetes cluster
...
Your Kubernetes control-plane has initialized successfully!

To start using your cluster, you need to run the following as a regular user:

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

You should now deploy a pod network to the cluster.
Run &quot;kubectl apply -f [podnetwork].yaml&quot; with one of the options listed at:
  https://kubernetes.io/docs/concepts/cluster-administration/addons/

You can now join any number of the control-plane node running the following command on each as root:

  kubeadm join k8smaster:6443 --token u8wkf7.4jdcnzjpya7k255h \
    --discovery-token-ca-cert-hash sha256:eb79e5bca6e41ac986bc465aee1bfca14a51bde5c392d8abc6f731c2a37b2b06 \
    --control-plane --certificate-key 88b4f0594ef2ab8632bbe9d0bff7a537f27387674499c5d0a1ebbc2a3fb5f752

Please note that the certificate-key gives access to cluster sensitive data, keep it secret!
As a safeguard, uploaded-certs will be deleted in two hours; If necessary, you can use
&quot;kubeadm init phase upload-certs --upload-certs&quot; to reload certs afterward.

Then you can join any number of worker nodes by running the following on each as root:

kubeadm join k8smaster:6443 --token u8wkf7.4jdcnzjpya7k255h \
    --discovery-token-ca-cert-hash sha256:eb79e5bca6e41ac986bc465aee1bfca14a51bde5c392d8abc6f731c2a37b2b06
</code></pre>
<h3 id="applyapodnetwork">Apply a Pod Network</h3>
<p>In the last step, kubeadm advised we should deploy a pod network to the cluster. To do that, we need to follow the directions to configure <code>kubectl</code> and then use it to apply the Calico Pod Network.</p>
<pre><code class="language-bash">$ mkdir -p $HOME/.kube
$ cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
$ chown $(id -u):$(id -g) $HOME/.kube/config
$ kubectl apply -f calico.yaml
</code></pre>
<h2 id="setupaworkernode">Set up a worker node</h2>
<p>The master node is good to go. It's time to set up a worker node.</p>
<blockquote>
<p>Don't forget to update the machine with <code>apt-get update &amp;&amp; apt-get upgrade</code> if you haven't done so yet.</p>
</blockquote>
<h3 id="installdocker">Install Docker</h3>
<p>We did this earlier on the master node.</p>
<pre><code class="language-bash">$ apt-get install -y docker.io
$ systemctl enable docker.service
</code></pre>
<h3 id="installkubeadmkubeletandkubectl">Install kubeadm, kubelet and kubectl</h3>
<p>Again, we just set this up on master, so it's just the same.</p>
<pre><code class="language-bash">$ curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -
$ cat &lt;&lt;EOF | sudo tee /etc/apt/sources.list.d/kubernetes.list
&gt; deb https://apt.kubernetes.io/ kubernetes-xenial main
&gt; EOF
$ sudo apt-get update
$ sudo apt-get install -y kubelet kubeadm kubectl
$ sudo apt-mark hold kubelet kubeadm kubectl
</code></pre>
<h3 id="addmastertohostsfile">Add master to hosts file</h3>
<p>Edit <code>/etc/hosts</code> and add a record for the local network IP.</p>
<pre><code>127.0.0.1 localhost
10.104.16.2 k8smaster  #&lt;-- add this row
</code></pre>
<h3 id="jointhecontrolplane">Join the control plane</h3>
<p>Run the command provided after running the kubeadm init on master.</p>
<pre><code class="language-bash">$ kubeadm join k8smaster:6443 --token u8wkf7.4jdcnzjpya7k255h \
  --discovery-token-ca-cert-hash sha256:eb79e5bca6e41ac986bc465aee1bfca14a51bde5c392d8abc6f731c2a37b2b06

[preflight] Running pre-flight checks
[WARNING IsDockerSystemdCheck]: detected &quot;cgroupfs&quot; as the Docker cgroup driver. The recommended driver is &quot;systemd&quot;. Please follow the guide at https://kubernetes.io/docs/setup/cri/
[preflight] Reading configuration from the cluster...
[preflight] FYI: You can look at this config file with 'kubectl -n kube-system get cm kubeadm-config -oyaml'
[kubelet-start] Writing kubelet configuration to file &quot;/var/lib/kubelet/config.yaml&quot;
[kubelet-start] Writing kubelet environment file with flags to file &quot;/var/lib/kubelet/kubeadm-flags.env&quot;
[kubelet-start] Starting the kubelet
[kubelet-start] Waiting for the kubelet to perform the TLS Bootstrap...

This node has joined the cluster:
* Certificate signing request was sent to apiserver and a response was received.
* The Kubelet was informed of the new secure connection details.

Run 'kubectl get nodes' on the control-plane to see this node join the cluster.
</code></pre>
<h2 id="viewthecluster">View the cluster</h2>
<p>The master VM has been enabled to run kubectl so go back there.</p>
<pre><code class="language-bash">$ kubectl get nodes
NAME        STATUS   ROLES    AGE   VERSION
master      Ready    master   75m   v1.19.2
worker-01   Ready    &lt;none&gt;   29m   v1.19.2
</code></pre>
<h2 id="testthecluster">Test the cluster</h2>
<p>Let's start something and confirm it's working.</p>
<pre><code class="language-bash">$ kubectl create deployment nginx --image nginx
$ kubectl get deployments
NAME    READY   UP-TO-DATE   AVAILABLE   AGE
nginx   1/1     1            1           2m
</code></pre>
<p>There you have it! A basic kubernetes cluster ready to go, running on a couple of VMs I've spun up.</p>
