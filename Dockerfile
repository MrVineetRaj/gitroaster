# Use official Node.js 22 image
FROM node:22

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Explicitly copy .env file first
COPY .env ./
# Copy the rest of your app
# Copy the rest of your app
COPY . .

RUN ls -la && sleep 5s

# Build the Next.js app
RUN npm run build

# Expose the port your app runs on
EXPOSE 3000

# Start the production app
CMD ["npm", "run", "start"]