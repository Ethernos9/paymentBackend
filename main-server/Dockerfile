# Use the official Node.js image
FROM node:20

# Install redis-cli
RUN apt-get update && apt-get install -y redis-tools

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the application port
EXPOSE 3000

# Set environment variables (optional, can also be done in .env file or docker-compose)
ENV NODE_ENV=production

# Start the main server
CMD ["npm", "start"]
