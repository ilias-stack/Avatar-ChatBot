FROM node:22.13.0-slim 

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Start the application
ENTRYPOINT ["npm", "run", "dev", "--", "--port=80", "--host=0.0.0.0"]