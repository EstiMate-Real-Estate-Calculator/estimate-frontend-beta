# Use the official Node.js image
FROM node:18-alpine as builder

# Install OpenSSL and other build dependencies
RUN apk add --no-cache openssl

# Set the working directory inside the container
WORKDIR /var/www/estimate-app

# First, copy only package files to leverage Docker cache
COPY package.json package-lock.json ./

# Install dependencies with specific flags to reduce warnings and issues
RUN npm install --production --frozen-lockfile --silent \
    && npm cache clean --force

# Copy the rest of the application code
COPY . .

# Add build arguments for environment variables
ARG DATABASE_URL
ARG STRIPE_SECRET_KEY

# Set environment variables for build
ENV DATABASE_URL=$DATABASE_URL
ENV STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY
ENV NODE_ENV=production

# Build the Next.js app
RUN npm run build \
    && npm prune --production

# Production image
FROM node:18-alpine

# Install OpenSSL in the production image
RUN apk add --no-cache openssl

WORKDIR /var/www/estimate-app

# Copy only the necessary files from builder
COPY --from=builder /var/www/estimate-app/package.json /var/www/estimate-app/package-lock.json ./
COPY --from=builder /var/www/estimate-app/.next ./.next
COPY --from=builder /var/www/estimate-app/public ./public
COPY --from=builder /var/www/estimate-app/node_modules ./node_modules

# Set production environment
ENV NODE_ENV=production

# Expose the port your app runs on
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:3000/ || exit 1

# Start the application
CMD ["npm", "start"]