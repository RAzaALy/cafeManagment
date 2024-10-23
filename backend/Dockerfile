# Use Node.js base image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Set the environment variable for production
ENV NODE_ENV=production

# Command to run your app
CMD ["npm", "start"]
