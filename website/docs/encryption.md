---
id: encrypt_secrets
title: Encrypt Secrets
---

![Sealed Secrets](https://github.com/raspbernetes/raspbernetes.github.io/raw/master/img/flux-secrets.png 'Sealed Secrets')

Sealed Secrets allows you to encrypt your secrets and safely store them in a `Git` repository, regardless of whether it's public or private.

## Prerequisites

You will need to download the `kubeseal` CLI .

### Homebrew

The kubeseal client is also available on homebrew:

```bash
$ brew install kubeseal
```

### Installation from source

If you just want the latest client tool, and compile it directly from source code instructions can be found [here](https://github.com/bitnami-labs/sealed-secrets/blob/master/README.md#installation-from-source)

## Public Key

To be able to encrypt secrets you need to have access to the public cert that the Sealed Secrets operator has created.

You can download the public cert using the following command:

```bash
curl -v -o $HOME/sealed-secret-public-cert.pem https://sealed-secrets.raspbernetes.com/v1/cert.pem
```

To simplify using the public cert with the `kubeseal` CLI we can make an alias

```bash
alias kubeseal='kubeseal --cert $HOME/sealed-secret-public-cert.pem --format yaml'
```

 *Note: Default format is json so we change it to yaml, however, if you prefer json then don't add the `--format` in your alias*

## Encrypt a Secret

> This assumes you already have a Kubenetes secret resource that you wish to encrypt into a Sealed Secret and store into source control.

Encrypt your Kubernetes secret with the `kubeseal` CLI using the following command:

```bash
$ kubeseal < secret.yaml > secret.encrypted.yaml
```

You can now commit `secret.encrypted.yaml` into source control, remember to remove the unencrypted secret.

Once the new encrypted secret is deployed into the Kubernetes cluster the Sealed Secrets operator will decrypt the secret and store it in-cluster as a Kubernetes secret.

Securing who can view the Kubernetes secrets is part of your defining a RBAC model, and not the role of Sealed Secrets.

**IMPORTANT**: Once a secret is encrypted you cannot change the name or namespace fields of that Sealed Secret, doing so will invalidate the encryption. To change these fields you will need to re-encrypt the secret again.
