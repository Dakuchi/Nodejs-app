# Use Node 18-alpine as the base image
FROM node:18-alpine

# Create the working directory
WORKDIR /home/app

# Copy package.json and package-lock.json first to leverage Docker caching
COPY ./app/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app files
COPY ./app /home/app

# Expose the app’s port
EXPOSE 3000

# Set the command to start the app
CMD ["node", "server.js"]

