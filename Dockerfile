# Use the official Node.js image as the base
FROM node:22

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Install TypeScript globally for building
RUN npm install -g typescript

# Build the TypeScript code to JavaScript
RUN npm run build

# Expose the port the app will run on
EXPOSE 8080

# Command to run the application (starts the compiled JavaScript code)
CMD ["node", "dist/index.js"]
