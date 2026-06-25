---
title: "Automatic HTTPS on Kubernetes"
slug: "automatic-https-on-kubernetes"
publishedAt: "2019-02-17T05:19:00.000Z"
updatedAt: "2020-01-11T05:21:57.000Z"
tags:
  - "kubernetes"
featureImage: "__GHOST_URL__/content/images/2020/01/cover-1.jpg"
type: "post"
---

<p>This post starts with a slight regret that I didn't get Ghost running on a Web App.  One of the brilliant parts of a Web App is that you can force all requests over HTTPS with the click of a button.<!-- more --> Of course, I'd still need to organise a certificate for my domain. Hold on, let me stop and back up a minute.</p>
<p>What the heck is this HTTPS and certificate stuff? Basically, HTTPS will guarantee that the communication between the client and server can't be read or changed by anyone between the client and server. So, usernames and passwords are safe to send. While that's important, it's probably more important that your pages cannot be changed either. It's a bit like a message written in code with the king's seal. Since the code (HTTPS) is known to you and the king, you know it cannot be read. The seal (certificate) proves the authenticity.</p>
<p>As I set out on this adventure, it looks like I need cert-manager and the best way to install this appears to be to use helm, which I installed with Chocolatey.</p>
<pre><code class="language-bash">$ choco install kubernetes-helm
$ helm init
</code></pre>
<h2 id="firststeps">First steps</h2>
<p>We are going to install cert-manager which will perform all of the magic of fetching certificates and storing them for use in our various services. We need to set up the config for cert-manager, so that we can provide the link to Lets Encrypt. Save the following in a file, say issuer.yaml, and run <code>kubectl apply -f issuer.yaml</code> to apply. (Make sure you update with your email first!)</p>
<pre><code class="language-yaml">apiVersion: certmanager.k8s.io/v1alpha1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory    
    email: youremail@gmail.com
    privateKeySecretRef:
      name: letsencrypt-prod
    http01: {}
</code></pre>
<h2 id="installingcertmanager">Installing cert manager</h2>
<pre><code class="language-bash">$ kubectl apply -f \
    https://raw.githubusercontent.com/jetstack/cert-manager/release-0.6/deploy/manifests/00-crds.yaml

$ helm install --name cert-manager --namespace ingress \
    --set ingressShim.defaultIssuerName=letsencrypt-prod 
    --set ingressShim.defaultIssuerKind=ClusterIssuer 
    stable/cert-manager
</code></pre>
<p>I ran into issues installing cert-manager with a 'cluster-admin' not found error. I found instructions on <a href="https://docs.bitnami.com/azure/get-started-aks/">this page</a> which helped me create a cluster admin role, create a service account and assign tiller to it.</p>
<h2 id="installingnginxingress">Installing nginx-ingress</h2>
<p>The next step is to configure an Ingress to manage the TLS endpoint, that is to manage my HTTPS endpoint with certificate connected to my domain. Without this step, I found I could set up my Ingress entry, but the address would stay empty.</p>
<pre><code class="language-bash">$ helm install stable/nginx-ingress \
    --name nginx \
    --set rbac.create=true \
    --namespace ingress
</code></pre>
<p>Once installed, I can see a LoadBalancer entry which has my External IP on it.</p>
<h2 id="updatetheservice">Update the Service</h2>
<p>In the previous post, we set the service up as a LoadBalancer type. We don't need that any more since we have a new IP on our LoadBalancer nginx-ingress service. Update the service.yaml and change LoadBalancer to a NodePort and run <code>kubectl apply -f service.yaml</code>. This will make sure we can only access our service through our TLS ingress service.</p>
<h2 id="generatecertificateandingressforservice">Generate Certificate and Ingress for Service</h2>
<p>Apply the following updates to the kubernetes cluster.</p>
<pre><code class="language-yaml">apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: anthonyison-ingress
  annotations:
    kubernetes.io/ingress.class: nginx
    certmanager.k8s.io/cluster-issuer: letsencrypt-prod
spec:
  tls:
  - hosts:
    - anthonyison.com
    secretName: anthonyison-crt
  rules:
  - host: anthonyison.com
    http:
      paths:
      - path: /
        backend:
          serviceName: anthonyison
          servicePort: 80
</code></pre>
<pre><code class="language-yaml">apiVersion: certmanager.k8s.io/v1alpha1
kind: Certificate
metadata:
  name: anthonyison-crt
spec:
  secretName: anthonyison-crt
  dnsNames:
  - anthonyison.com
  acme:
    config:
    - http01:
        ingressClass: nginx
      domains:
      - anthonyison.com
  issuerRef:
    name: letsencrypt-prod
    kind: ClusterIssuer
</code></pre>
<p>That's it!  Hit your domain and confirm that https is working. You should be able to click on the padlock in the address bar and click on Certificate to see the details. You should see a certificate issued by Lets Encrypt to your domain name.</p>
<p>So, I started off with some regret that I wasn't running in a Web App. While it took quite a while to work through many of the issues that showed up along the way, it is actually pretty easy once it's set up, and furthermore, I don't have to think about my certificates ever again. I think maybe it's not as bad as I thought. No regrets, right?</p>
<h3 id="references">References:</h3>
<ol>
<li><a href="https://itnext.io/automated-tls-with-cert-manager-and-letsencrypt-for-kubernetes-7daaa5e0cae4">Automated TLS with Cert Manager and Lets Encrypt for Kubernetes</a></li>
<li><a href="https://akomljen.com/get-automatic-https-with-lets-encrypt-and-kubernetes-ingress/">Get automatic HTTPS with Lets Encrpyt and Kubernetes Ingress</a></li>
<li><a href="https://runnable.com/blog/how-to-use-lets-encrypt-on-kubernetes">How to use Lets Encrypt on Kubernetes (without Cert Manager)</a></li>
<li><a href="https://docs.bitnami.com/azure/get-started-aks/">Configuring AKS</a></li>
<li><a href="https://dzone.com/articles/secure-your-kubernetes-services-using-cert-manager">Secure your Kubernetes Services using Cert Manager</a></li>
</ol>
