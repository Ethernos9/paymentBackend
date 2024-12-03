# Use the official Node.js image
FROM node:20

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Set environment variables (optional, can also be done in .env file or docker-compose)
ENV NODE_ENV=production

# Start the worker process
CMD ["node", "worker.js"]
