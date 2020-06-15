---
id: cis-benchmark
title: CIS Benchmark
---

| ID | Description | Code |
|:--:| ----------- |:---:|
| CIS.1.2.1  | Ensure that the --anonymous-auth argument is set to false | [Link](https://github.com/raspbernetes/k8s-gitops/blob/master/policies/CIS.1.2.1.rego) |
| CIS.1.2.10 | Ensure that the admission control plugin EventRateLimit is set | [Link](https://github.com/raspbernetes/k8s-gitops/blob/master/policies/CIS.1.2.10.rego) |
| CIS.1.2.11 | Ensure that the admission control plugin AlwaysAdmit is not set | [Link](https://github.com/raspbernetes/k8s-gitops/blob/master/policies/CIS.1.2.11.rego) |
| CIS.1.2.12 | Ensure that the admission control plugin AlwaysPullImages is set| [Link](https://github.com/raspbernetes/k8s-gitops/blob/master/policies/CIS.1.2.12.rego) |
| CIS.1.2.13 | Ensure that the admission control plugin SecurityContextDeny is set if PodSecurityPolicy is not used | [Link](https://github.com/raspbernetes/k8s-gitops/blob/master/policies/CIS.1.2.13.rego) |
| CIS.1.2.14 | Ensure that the admission control plugin ServiceAccount is set| [Link](https://github.com/raspbernetes/k8s-gitops/blob/master/policies/CIS.1.2.14.rego) |
| CIS.1.2.15 | Ensure that the admission control plugin NamespaceLifecycle is set | [Link](https://github.com/raspbernetes/k8s-gitops/blob/master/policies/CIS.1.2.15.rego) |
| CIS.1.2.16 | Ensure that the admission control plugin PodSecurityPolicy is set| [Link](https://github.com/raspbernetes/k8s-gitops/blob/master/policies/CIS.1.2.16.rego) |
| CIS.1.2.17 | Ensure that the admission control plugin NodeRestriction is set| [Link](https://github.com/raspbernetes/k8s-gitops/blob/master/policies/CIS.1.2.17.rego) |
| CIS.1.4.1 | Ensure that the --profiling argument is set to false | [Link](https://github.com/raspbernetes/k8s-gitops/blob/master/policies/CIS.1.4.1.rego) |
| CIS.2.1 | Ensure that the --cert-file and --key-file arguments are set as appropriate | [Link](https://github.com/raspbernetes/k8s-gitops/blob/master/policies/CIS.2.1.rego) |
| CIS.2.2 | Ensure that the --client-cert-auth argument is set to true | [Link](https://github.com/raspbernetes/k8s-gitops/blob/master/policies/CIS.2.2.rego) |
| CIS.2.3 | Ensure that the --auto-tls argument is not set to true | [Link](https://github.com/raspbernetes/k8s-gitops/blob/master/policies/CIS.2.3.rego) |
| CIS.2.4 | Ensure that the --peer-cert-file and --peer-key-file arguments are set as appropriate | [Link](https://github.com/raspbernetes/k8s-gitops/blob/master/policies/CIS.2.4.rego) |
| CIS.2.5 | Ensure that the --peer-client-cert-auth argument is set to true | [Link](https://github.com/raspbernetes/k8s-gitops/blob/master/policies/CIS.2.5.rego) |
| CIS.2.6 | Ensure that the --peer-auto-tls argument is not set to true | [Link](https://github.com/raspbernetes/k8s-gitops/blob/master/policies/CIS.2.6.rego) |
| CIS.2.7 | Ensure that a unique Certificate Authority is used for etcd | [Link](https://github.com/raspbernetes/k8s-gitops/blob/master/policies/CIS.2.7.rego) |
| CIS.5.1.1 | Ensure that the cluster-admin role is only used where required | [Link](https://github.com/raspbernetes/k8s-gitops/blob/master/policies/CIS.5.1.1.rego) |
| CIS.5.1.3 | Minimize wildcard use in Roles and ClusterRoles  | [Link](https://github.com/raspbernetes/k8s-gitops/blob/master/policies/CIS.5.1.3.rego) |
| CIS.5.5.1 | Configure Image Provenance using ImagePolicyWebhook admission controller | [Link](https://github.com/raspbernetes/k8s-gitops/blob/master/policies/CIS.5.5.1.rego) |
