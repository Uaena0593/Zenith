FROM node:latest

WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy all other files to the container
COPY . .

# Build the application (for production, you can uncomment this)
# RUN npm run build

# Command to run the application in development mode
CMD ["npm", "run", "dev"]