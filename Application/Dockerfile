FROM node:22.13.0-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Ensure the correct port is exposed (default for Vite is 5173)
EXPOSE 5173

# Start the application
CMD ["npm", "run", "dev"]