# Use a lightweight Node.js base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package definition first to cache dependencies
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the server source code
COPY server.js ./

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]