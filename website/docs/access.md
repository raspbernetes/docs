---
id: remote_kubectl_access
title: Remote Kubectl Access
---

![Remote Kubectl Access](../static/img/docs/kubectl.png 'Remote Kubectl Access')

## Connect from a client machine

The following instructions will setup remote kubectl access to the Kubernetes cluster.

> *Note: This will only work if you're part of the Raspbernetes project and have been granted access by an admin.*

### Install The Cloudflare Daemon On The Client Machine

Download and install `cloudflared` on the client desktop that will connect to the resource using these following [instructions](https://developers.cloudflare.com/argo-tunnel/downloads).

> *`Cloudflared` will need to be installed on each user device that will connect to the kube-apiserver.*

### Connect To The Resource

Run the following command to create a connection from the device to Cloudflare. Any available port can be specified.

```bash
$ cloudflared access tcp --hostname api.raspbernetes.com --url 127.0.0.1:1234
```

With this service running, you can run a `kubectl` command and `cloudflared` will launch a browser window and prompt the user to authenticate with the Github SSO provider. Once authenticated, `cloudflared` will expose the connection to the client machine at the local URL specified in the command.

`kubeconfig` does not support proxy command configurations at this time, though the community has submitted plans to do so. In the interim, users can alias the cluster's API server to save time.

```bash
$ alias kubeone="env HTTPS_PROXY=socks5://127.0.0.1:1234 kubectl"
```

To test that the connection is working correctly, check the alias with a simple command to see if it returns the appropriate information.

EG:

```bash
kubeone get nodes
```

Result:

```bash
NAME            STATUS   ROLES    AGE   VERSION
k8s-master-01   Ready    master   8h    v1.18.6
k8s-master-02   Ready    master   8h    v1.18.6
k8s-master-03   Ready    master   8h    v1.18.6
k8s-worker-01   Ready    <none>   8h    v1.18.6
```

If successful you should now have complete access to the cluster using the alias set. Additionally, the cluster has RBAC enabled and the correct user permissions **must** be granted by an admin.

### Additional Information

How to configure SOCK5 proxy using cloudflare argo tunnel to connect the cluster to Cloudflare can be found [here](https://developers.cloudflare.com/access/other-protocols/kubectl/)
