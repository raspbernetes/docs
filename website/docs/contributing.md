---
id: contributing
title: Contributing
---

Raspbernetes repositories are [Apache 2.0](LICENSE) licensed and accepts contributions via GitHub pull requests. Before contributing, make sure to have read the [Code of Conduct](https://github.com/raspbernetes/k8s-cluster-installation/blob/master/CODE_OF_CONDUCT.md).

We welcome contributions to all [Raspbernetes](https://github.com/raspbernetes) projects.

If you haven't already, come find us at [Discord][discord].

Here are some important resources:

* Bugs or new features? [Github Issues](https://github.com/raspbernetes/k8s-cluster-installation/issues) is where to report them
* Discord: k8s@home [#general][discord]. With contributors in both hemispheres, there's probably always someone available.

[discord]: https://discord.gg/RGvKzVg

## Testing

### Kubernetes

All resources created will run through our continuous integration pipeline; It will run:

* YAML Linting
* Kubeval
* Conftest

### Docker

All images maintained in our [multi-arch-images](https://github.com/raspbernetes/multi-arch-images) repository will run `hadolint`.

### Ansible

We run `ansible-lint` on everything related to Ansible.

## Submitting changes

Please send a GitHub Pull Request with a clear list of what you've done (read more about [pull requests](http://help.github.com/pull-requests/)). Please follow our coding conventions (below) and make sure all of your commits are atomic (one feature per commit).

Always write a clear log message for your commits. One-line messages are fine for small changes, but bigger changes should look like this:

$ git commit -m "A brief summary of the commit

> A paragraph describing what changed and its impact."

Always sign-off your commits (`git commit --signoff`).

## Coding conventions

Start reading our code and you'll get the hang of it. We optimize for readability:

* We indent using two spaces (soft tabs)
* We use YAML with the extension `.yml`
* We like to keep `ansible-lint` happy and error/warning free.
* Always end all files with a newline
* This is open source software. Consider the people who will read your code, and make it look nice for them.

It's sort of like driving a car: Perhaps you love doing donuts when you're alone, but with passengers the goal is to make the ride as smooth as possible.

Thanks,

Raspbernetes Team
