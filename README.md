# Node.js App with MongoDB on Kubernetes

This project is a simple Node.js application that interacts with MongoDB to store and manage user inputs. The app is deployed on Kubernetes and includes integrated health checks, readiness probes, and metrics for monitoring with Prometheus and Grafana.

## Project Structure

```plaintext
.
+--- app
|   +--- images
|   |   +--- profile-1.jpg
|   |   +--- profile-2.jpg
|   +--- index.html
|   +--- package-lock.json
|   +--- package.json
|   +--- server.js
+--- docker-compose.yaml
+--- Dockerfile
+--- nodeapp-mongo-deployment.yaml
+--- README.md
```
Key Files:
* `server.js`: Main application file containing routes and MongoDB connection logic.
* `nodeapp-mongo-deployment.yaml`: Kubernetes configuration file for deploying the Node.js app, MongoDB, and a ServiceMonitor for Prometheus.

## Application Features
* Endpoints:
    * `/`: Serves the main HTML page.
    * `/profile-picture`: Returns a user profile image.
    * `/health`: Health check endpoint.
    * `/readiness`: Readiness check endpoint.
    * `/metrics`: Exposes Prometheus metrics for monitoring.
    * `/get-profile`: Retrieves user profile from MongoDB.
    * `/update-profile`: Updates user profile in MongoDB.
    
## Prerequisites
##### 1. Docker and Kubernetes.
##### 2. kubectl: Command-line tool for interacting with Kubernetes.
##### 3. Prometheus and Grafana deployed on the cluster for monitoring.
## Deployment Instructions
##### 1. Build Docker Image
    docker build -t your-repo/demo-app:k8sEnv .
##### 2. Push Docker Image: Tag and push your Docker image to a container registry.
    docker push your-repo/demo-app:k8sEnv
##### 3. Deploy to Kubernetes: Apply the Kubernetes deployment configuration for the Node.js app and MongoDB:
    kubectl apply -f nodeapp-mongo-deployment.yaml

## Environment Variables
The following environment variables are used for flexibility in the Kubernetes configuration (nodeapp-mongo-deployment.yaml):
* `MONGO_URL`: MongoDB connection string.
* `MONGO_DB_NAME`: Name of the MongoDB database.
## Health Checks
The app includes /health and /readiness endpoints, used by Kubernetes for:

* Liveness Probe: Ensures the app is healthy.
* Readiness Probe: Ensures the app is ready to handle traffic.

## Monitoring
This setup includes a ServiceMonitor configuration to expose metrics for Prometheus. The metrics endpoint (/metrics) provides default and custom metrics, allowing to track HTTP request counts and durations.
### Prometheus Metrics Endpoints
* `http_request_operations_total`: Total number of HTTP requests.
* `http_request_duration_seconds`: Duration of HTTP requests.

## Viewing Metrics in Grafana
Once Prometheus scrapes the metrics, you can visualize them in Grafana. Ensure that Grafana is connected to Prometheus and configured to display the metrics from the nodeapp application.
