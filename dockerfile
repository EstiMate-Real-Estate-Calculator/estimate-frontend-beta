# Use the official Node.js image
FROM node:18-alpine as builder

# Install dependencies
RUN apk add --no-cache openssl

# Set working directory inside the container
WORKDIR /var/www/estimate-app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

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

# Install OpenSSL in the production image
RUN apk add --no-cache openssl

# Set working directory inside the container
WORKDIR /var/www/estimate-app

# Copy necessary files from builder
COPY --from=builder /var/www/estimate-app/package.json /var/www/estimate-app/package-lock.json ./
COPY --from=builder /var/www/estimate-app/.next ./.next
COPY --from=builder /var/www/estimate-app/public ./public
COPY --from=builder /var/www/estimate-app/node_modules ./node_modules

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
