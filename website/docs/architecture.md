---
id: architecture
title: Architecture
---

The following diagram demonstrates the overall cluster design which will be implemented via the Ansible automation if you follow the above guide.

> To obtain a highly available Kubernetes cluster we've chosen to use the [stacked etcd toplogy](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/ha-topology/#stacked-etcd-topology). This is the default configuration as the [external etcd cluster](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/ha-topology/#external-etcd-topology) alternative requires additional compute resources.

![cluster-design](https://github.com/raspbernetes/k8s-cluster-installation/blob/master/docs/images/raspbernetes-cluster-design.png)

## Network topology

|IP|Function|
| :---: | :---: |
|192.168.1.1|Router|
|192.168.1.121|master (k8s-master-01)|
|192.168.1.122|master (k8s-master-02)|
|192.168.1.123|master (k8s-master-03)|
|192.168.1.131|worker (k8s-worker-01)|
