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

### Developing on Google

- Create project (i.e. `marc-ticketing-dev`)
- Enable Kubernetes
- Create a cluster (i.e. `ticketing-dev`).
    - Change machine type to `g1-small` (save costs)
    - Change GKE version to the highest available (i.e. `1.15.11-gke.12`)
- Setup gcloud to point at project using `gcloud init` (region/zone should be the same as the cluster)
- Connect to cluster using `gcloud container clusters get-credentials ticketing-dev`
- In the Docker desktop, you can now switch between Kubernetes ->
    - `docker-desktop` (local)
    - `gke_marc-ticketing-dev_australia-southeast1-a_ticketing-dev` (GKE)
- Enable Tools -> Google Cloud Build (Enable button)

## Setup NGINX (for GCP)

- Go to [https://kubernetes.github.io/ingress-nginx/](https://kubernetes.github.io/ingress-nginx/) 
- Find the GCP command. I.e. Initialise your user as a cluster-admin with the following:

`kubectl create clusterrolebinding cluster-admin-binding \
   --clusterrole cluster-admin \
   --user $(gcloud config get-value account)`
   
Then setup NGINX with:

`kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-0.32.0/deploy/static/provider/cloud/deploy.yaml`

## Update hosts again

- Go to the cloud console, Network Services -> Load Balancing
- Click on the name (i.e. `a33f08abb41c3457591697d1d101ff84`)
- This will provide the IP address for ports 80/433 - i.e. `34.87.236.133`
- edit file `/etc/hosts`
- add `34.87.236.133 ticketing.dev`
