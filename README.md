# Ticketing Microservices Demo

Node JS &amp; React Microservices demo project

### Create a new service

- create a new directory and cd into directory
- `npm init -y` to create the `package.json` file
- `npm install ts-node-dev typescript express @types/express` to get essential dependencies (add others as required)
- `sudo npm install -g typescript` to install typescript (if not already installed)
- `tsc --init` to create `tsconfig.json` file

### Ingress NGINX Setup (for local development)

- Use `ingress-nginx` - which creates a load balancer and ingress pod. See [https://kubernetes.github.io/ingress-nginx/](https://kubernetes.github.io/ingress-nginx/) 
- Be careful not to use `kubernetes-ingress` (which does almost the same thing)

To setup locally (on mac)

`kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-0.32.0/deploy/static/provider/cloud/deploy.yaml`

To view ingress

`kubectl get ingress`

### Update hosts

- edit file `/etc/hosts`
- add `127.0.0.1 ticketing.dev`

To circumnavigate the self signed certificate error in chrome, click anywhere on the page and type `thisisunsafe`
