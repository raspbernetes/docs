---
id: architecture
title: Architecture
---

The following diagram demonstrates the overall cluster design which will be implemented via the Ansible automation if you follow the above guide.

> To obtain a highly available Kubernetes cluster we've chosen to use the [stacked etcd toplogy](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/ha-topology/#stacked-etcd-topology). This is the default configuration as the [external etcd cluster](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/ha-topology/#external-etcd-topology) alternative requires additional compute resources.

![cluster-design](https://github.com/raspbernetes/k8s-cluster-installation/blob/master/docs/images/raspbernetes-cluster-design.png)
