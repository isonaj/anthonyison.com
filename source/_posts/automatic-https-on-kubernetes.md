---
title: Automatic HTTPS on Kubernetes
date: 2019-02-17
tags: kubernetes
cover_img: /images/1200px-Rusty_Padlock.jpg
feature_img: /images/1200px-Rusty_Padlock.jpg
description: 
keywords: 
---
This post starts with a slight regret that I didn't get Ghost running on a Web App.  One of the brilliant parts of a Web App is that you can force all requests over HTTPS with the click of a button. Of course, I'd still need to organise a certificate for my domain. Hold on, let me stop and back up a minute.

<!-- more -->

What the heck is this HTTPS and certificate stuff? Basically, HTTPS will guarantee that the communication between the client and server can't be read or changed by anyone between the client and server. So, usernames and passwords are safe to send. While that's important, it's probably more important that your pages cannot be changed either. It's a bit like a message written in code with the king's seal. Since the code (HTTPS) is known to you and the king, you know it cannot be read. The seal (certificate) proves the authenticity.

As I set out on this adventure, it looks like I need cert-manager and the best way to install this appears to be to use helm, which I installed with Chocolatey.

choco install kubernetes-helm
helm init
First steps
We are going to install cert-manager which will perform all of the magic of fetching certificates and storing them for use in our various services. We need to set up the config for cert-manager, so that we can provide the link to Lets Encrypt. Save the following in a file, say issuer.yaml, and run 'kubectl apply -f issuer.yaml' to apply. (Make sure you update with your email first!)

```yaml
apiVersion: certmanager.k8s.io/v1alpha1
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
```

Installing cert manager
kubectl apply -f \
    https://raw.githubusercontent.com/jetstack/cert-manager/release-0.6/deploy/manifests/00-crds.yaml

helm install --name cert-manager --namespace ingress \
    --set ingressShim.defaultIssuerName=letsencrypt-prod 
    --set ingressShim.defaultIssuerKind=ClusterIssuer 
    stable/cert-manager
I ran into issues installing cert-manager with a 'cluster-admin' not found error. I found instructions on this page[4] which helped me create a cluster admin role, create a service account and assign tiller to it.

Installing nginx-ingress
The next step is to configure an Ingress to manage the TLS endpoint, that is to manage my HTTPS endpoint with certificate connected to my domain. Without this step, I found I could set up my Ingress entry, but the address would stay empty.

helm install stable/nginx-ingress \
    --name nginx \
    --set rbac.create=true \
    --namespace ingress
Once installed, I can see a LoadBalancer entry which has my External IP on it.

Update the Service
In the previous post, we set the service up as a LoadBalancer type. We don't need that any more since we have a new IP on our LoadBalancer nginx-ingress service. Update the service.yaml and change LoadBalancer to a NodePort and run 'kubectl apply -f service.yaml'. This will make sure we can only access our service through our TLS ingress service.

Generate Certificate and Ingress for Service
Apply the following updates to the kubernetes cluster.

```yaml
apiVersion: extensions/v1beta1
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
apiVersion: certmanager.k8s.io/v1alpha1
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
```

That's it!  Hit your domain and confirm that https is working. You should be able to click on the padlock in the address bar and click on Certificate to see the details. You should see a certificate issued by Lets Encrypt to your domain name.

So, I started off with some regret that I wasn't running in a Web App. While it took quite a while to work through many of the issues that showed up along the way, it is actually pretty easy once it's set up, and furthermore, I don't have to think about my certificates ever again. I think maybe it's not as bad as I thought. No regrets, right?

References:

[1]: https://itnext.io/automated-tls-with-cert-manager-and-letsencrypt-for-kubernetes-7daaa5e0cae4 "Automated TLS with Cert Manager and Lets Encrypt for Kubernetes"

[2]: https://akomljen.com/get-automatic-https-with-lets-encrypt-and-kubernetes-ingress/ "Get automatic HTTPS with Lets Encrpyt and Kubernetes Ingress"

[3]: https://runnable.com/blog/how-to-use-lets-encrypt-on-kubernetes "How to use Lets Encrypt on Kubernetes (without Cert Manager)"

[4]: https://docs.bitnami.com/azure/get-started-aks/ "Configuring AKS"

[5]: https://dzone.com/articles/secure-your-kubernetes-services-using-cert-manager "Secure your Kubernetes Services using Cert Manager"