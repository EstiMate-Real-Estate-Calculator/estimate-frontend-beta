# Use the official Node.js image from a different registry (e.g., GitHub Container Registry)
FROM node:18-alpine as builder

# Set the working directory inside the container
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Add build arguments for environment variables
ARG DATABASE_URL
ARG STRIPE_SECRET_KEY

# Set environment variables for build
ENV DATABASE_URL=$DATABASE_URL
ENV STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY

# Build the Next.js app
RUN npm run build

# Production image
FROM node:18-alpine

WORKDIR /app

# Copy necessary files from builder
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Expose the port your app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]