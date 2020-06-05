---
id: installation
title: Installation
---

This guide will walk through the steps required to bootstrap a running Kubernetes cluster with a highly available topology.

> Note: If you wish to use Raspbian Lite please use the following [guide](raspbian/README.md).

## Prerequisites

Prior to getting started you will need to install the following tools:

- [Ansible](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html)
- [Flash](https://github.com/hypriot/flash#installation)
- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)

## Setup Operating System

## Configure Cloud Init

## Flash SD Cards

Once the Raspberry Pi's are running and all the prerequisites have been completed we're now ready to setup the Ansible inventory.

Open the [inventory file](ansible/inventory) - each machine that will be joining the Kubernetes cluster must be defined as either a master or worker node. To leverage the highly available topology configuration you would ideally have 3 masters available as a minimum, otherwise 1 master node is fine, however, it won't be highly available.

> Note: Ensure the `hostname` matches what the machine was given when flashed the SD card and `ansible_host` matches the IP allocated to the host on your preferred subnet.

When the inventory has been configured with all the hosts that will be joining the Kubernetes cluster we can run the following command to verify SSH connectivity can be established.

```bash
ansible all -m ping -i ansible/inventory -u pi
```

A successful response should look something like the following:

```diff
k8s-worker-01 | SUCCESS => {
  ...
  "changed": false,
  "ping": "pong"
  ...
}
```

> Note: If your output returns success for each ping then you can continue, otherwise there may be some misconfiguration of either the inventory file, or network connectivity issues.

There are a variety of different configurable options in the Ansible automation. These options can be located in the [vars.yml](ansible/vars.yml) file.

## Container Runtime Interface

Below is a matrix of the currently supported options.

**Container Runtime**

| Name | Supported |
| ---- | --------- |
| Docker | Yes |
| ContainerD | Yes |

## Container Network Interace

**Container Network Interface**

| Name | Supported |
| ---- | --------- |
| Weave | Yes |
| Flannel | Yes |

Assuming all previous steps and configuration are correct the last thing to do is to execute the playbook. The playbook that should be used is the `k8s-all.yml` playbook, this will handle all the master and worker node logic and sequencing.

```bash
env ANSIBLE_CONFIG=ansible.cfg ansible-playbook \
    -i ansible/inventory \
    ansible/playbooks/k8s-all.yml
```

If there was no errors you should be able to execute the following command to check the status of the nodes in the cluster:

```bash
k get nodes --kubeconfig ansible/playbooks/output/k8s-config.yaml
```

Output:

```bash
NAME            STATUS     ROLES    AGE     VERSION
k8s-master-01   Ready      master   4m45s   v1.17.4
k8s-master-02   Ready      master   70s     v1.17.4
k8s-master-03   Ready      master   79s     v1.17.4
k8s-worker-01   Ready      <none>   16s     v1.17.4
```

**Congratulations!** you have successfully started your own Kubernetes cluster!

> If you weren't lucky enough to have everything successful on the first attempt please open an [issue](https://github.com/raspbernetes/k8s-cluster-installation/issues/new) with as much context and we'll try to solve and improve for future people.

