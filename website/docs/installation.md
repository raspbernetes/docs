---
id: installation
title: Installation
---

This guide will walk through the steps required to bootstrap a running Kubernetes cluster with a highly available topology.

## Prerequisites

### Hardware

It’s recommended to have at least 4 raspberry pis as a minimum. Through this guide 3 will be used as master nodes, and 1 will be used as a worker node, however, having more is completely fine.

### Software

You will need the following CLI tools to be able to follow the steps in this guide:

#### Ansible

Ansible can be installed using the following commands:

```bash
sudo apt-get install software-properties-common
sudo apt-add-repository ppa:ansible/ansible
sudo apt-get update
sudo apt-get install ansible
```

#### Flash

Install flash via Hypriot's download:

```bash
sudo curl -L "https://github.com/hypriot/flash/releases/download/2.5.0/flash" -o /usr/local/bin/flash
sudo chmod +x /usr/local/bin/flash
```

#### kubectl

kubectl can be installed via kubernetes own [instructions](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/).

### Finally, clone [Raspernetes](https://github.com/raspbernetes/k8s-cluster-installation)

Clone the repo into your local machine and then follow the instructions to flash your control planes and nodes.

## Flash SD Cards

To configure each node with a unique IP and hostname we use cloud-init. This is a method for cross-platform cloud instance initialization which also works for bare-metal installations.

The operating system used in this guide will be Ubuntu 20.04, run the following command to download the image:

```bash
# Download the Ubuntu 20.04 Focal image for Raspberry Pis
curl -L "http://cdimage.ubuntu.com/releases/focal/release/ubuntu-20.04.2-preinstalled-server-arm64+raspi.img.xz" -o ~/Downloads/ubuntu-20.04.2-preinstalled-server-arm64+raspi.img.xz
# Extract the downloaded files
unxz -T 0 ~/Downloads/ubuntu-20.04.2-preinstalled-server-arm64+raspi.img.xz
```

The following steps will configure networking for the nodes automatically using cloud-init on boot( steps 4 to 6 must be repeated for each node):

1. Open the cloud-config file.

2. Update the gateway4 value to match the IP of your router. (If unsure you can find this IP using this guide)

3. Update the ssh_authorized_keys value with your own keys, enabling secure SSH access to each node without further configuration. (Highly recommended and there are a lot of guides that will explain how to setup SSH keys if you haven’t already)

4. Update the hostname value to be unique per node.

5. Update the addresses value to be a unique IP per node.

6. Flash the OS image and cloud-init configuration onto the Raspberry Pi using the following command:

```bash
flash \
  --userdata setup/cloud-config.yml \
  ~/Downloads/ubuntu-20.04.2-preinstalled-server-arm64+raspi.img
```

## Cluster Configuration

### Basic Setup

*Note: This will initialize your cluster with default CRI & CNI configuration, for more advanced configuration, check the “Advanced Setup” options.*

Now we have all our Raspberry Pi nodes running and are configured with a unique hostname, IP, we now need to declare these values in the Ansible inventory file.

See below for an example of how I configured my 3 master nodes and 1 worker node.

```bash
[masters]
k8s-master-01 hostname=k8s-master-01 ansible_host=192.168.1.121 ansible_user=pi
k8s-master-02 hostname=k8s-master-02 ansible_host=192.168.1.122 ansible_user=pi
k8s-master-03 hostname=k8s-master-03 ansible_host=192.168.1.123 ansible_user=pi
[workers]
k8s-worker-01 hostname=k8s-worker-01 ansible_host=192.168.1.131 ansible_user=pi
```

When the inventory has been configured with all hosts, there is one last thing we must configure. We need to assign a VIP (“Virtual IP”) that will be used to load-balance across the HA master nodes.

Open masters.yml and configure the keepalived_vip value to an unassigned IP. For my configuration I use 192.168.1.200 .
Run the following command to verify SSH connectivity.

```bash
env ANSIBLE_CONFIG=ansible/ansible.cfg ansible all -m ping
```

A successful response should look something like the following:

```bash
k8s-master-01 | SUCCESS => {
  ...
  "ping": "pong"
  ...
}
```

Note: If your output returns success for each ping then you can continue, otherwise there may be some misconfiguration of either the inventory file or network connectivity issues.

Now we’ve tested network connectivity we can run the automation scripts that will take care of deploying Kubernetes using the following:

```bash
env ANSIBLE_CONFIG=ansible/ansible.cfg ansible-playbook ansible/playbooks/all.yml
```

Once successfully completed you can use kubectl to interact with your Kubernetes cluster:

```bash
kubectl get nodes --kubeconfig ansible/playbooks/output/k8s-config.yaml
```

The expected output should look something like the following:

```bash
NAME            STATUS     ROLES    AGE     VERSION
k8s-master-01   Ready      master   1m0s     v1.19.5
k8s-master-02   Ready      master   1m0s     v1.19.5
k8s-master-03   Ready      master   1m0s     v1.19.5
k8s-worker-01   Ready      <none>   1m0s     v1.19.5
```

**Congratulations!** You now have a running Kubernetes cluster running on Raspberry Pis.

### Advanced Setup

This section is an appendage to the “Basic Setup” however, will explore more of the advanced configuration that is available.

The configuration options can be found in the group_vars folder where you have the files all.yml, masters.yml, and workers.yml. These files contain the configurable variables of each role.

## Cleanup

Tear down the cluster and remove everything using the following command:

```bash
env ANSIBLE_CONFIG=ansible/ansible.cfg ansible-playbook ansible/playbooks/nuke.yml
```

## Summary

You’ve successfully created a Kubernetes cluster with a highly available topology on Raspberry Pis.

You now have learned how to configure networking, flash your operating system, set up some basic cluster configuration, and now have the Kubernetes cluster to continue your learning and self-improvement.
