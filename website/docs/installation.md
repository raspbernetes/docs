---
id: installation
title: Installation
---

This guide will walk through the steps required to bootstrap a running Kubernetes cluster with a highly available topology.

## Prerequisites

Prior to getting started you will need to install the following tools on your machine:

- [Ansible](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html)
- [Flash](https://github.com/hypriot/flash#installation)
- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)

## Setup Operating System

> Note:
> If you wish to use the Raspbian Lite OS please use the following [guide](https://github.com/raspbernetes/k8s-cluster-installation/blob/master/raspbian/README.md).

## Configure Cloud Init

Open [cloud-config](https://github.com/raspbernetes/k8s-cluster-installation/blob/master/setup/cloud-config.yml), you need to change a few fields that will be used to flash for for your Raspberry Pi in this file.

```bash
hostname: k8s-master-01
```

This will be the hostname for your nodes, make sure you change names for your different nodes and note them down.

```bash
users:
    ssh_authorized_keys:
      - ''
```

Put the ssh key of your local machine that you want to access the nodes, so you can ssh to them.

```bash
write_files:
  - path: /etc/netplan/50-cloud-init.yaml
    permissions: '0644'
    content: |
      network:
        version: 2
        ethernets:
          eth0:
            addresses:
              - 192.168.1.121/24  # change to your RPi's ip address
            gateway4: 192.168.1.1 # change to your gateway address
            nameservers:
              addresses:
                - 1.1.1.1
                - 8.8.8.8
```

You also need to change the addresses to your RPi's ip address and gateway4 to your gateway's address.

## Flash SD Cards

#### Downloads the Flash tool

If you haven't install `flash`, you can run below command:

```bash
sudo curl -L "https://github.com/hypriot/flash/releases/download/2.5.0/flash" -o /usr/local/bin/flash
sudo chmod +x /usr/local/bin/flash
```

#### Download and extract the image

Follow the following command to download `ubuntu-20.04` image and extract it.

```bash
curl -L "http://cdimage.ubuntu.com/releases/focal/release/ubuntu-20.04-preinstalled-server-arm64+raspi.img.xz" -o ~/Downloads/ubuntu-20.04-preinstalled-server-arm64+raspi.img.xz
unxz -T 0 ~/Downloads/ubuntu-20.04-preinstalled-server-arm64+raspi.img.xz
```

#### Flash

```bash
flash \
    --userdata setup/cloud-config.yml \
    ~/Downloads/ubuntu-20.04-preinstalled-server-arm64+raspi.img
```

#### Boot

Place the SD Card in your RPi and give the system approx ~10 minutes to boot before trying to SSH.

## Configure Nodes

Once the Raspberry Pi's are running and all the prerequisites have been completed we're now ready to setup the Ansible inventory.

Open the [inventory file](https://github.com/raspbernetes/k8s-cluster-installation/blob/master/ansible/inventory) - each machine that will be joining the Kubernetes cluster must be defined as either a master or worker node. To leverage the highly available topology configuration you would ideally have 3 masters available as a minimum, otherwise 1 master node is fine, however, it won't be highly available.

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

There are a variety of different configurable options in the Ansible automation. These options can be located in the [vars.yml](https://github.com/raspbernetes/k8s-cluster-installation/blob/master/ansible/vars.yml) file, please read [Advanced installation](advanced_installation.md) for more information.

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
