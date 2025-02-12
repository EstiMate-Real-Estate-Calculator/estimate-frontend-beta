# 1) Build Stage
FROM node:18-alpine as builder

# Install any OS dependencies you need (e.g., OpenSSL)
RUN apk add --no-cache openssl

# Set working directory
WORKDIR /var/www/estimate-app

# Copy only package files first for better Docker caching
COPY package.json package-lock.json ./

# Clean npm cache and install dependencies
RUN npm cache clean --force && \
    rm -rf node_modules && \
    npm install || { echo "npm install failed"; exit 1; }

# Copy the entire project
COPY . .

# Build environment variables
ARG DATABASE_URL
ARG STRIPE_SECRET_KEY
ENV DATABASE_URL=$DATABASE_URL
ENV STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY
ENV NODE_ENV=production

# Build the Next.js app
RUN npm run build || { echo "build failed"; exit 1; }

# Prune devDependencies
RUN npm prune --production

# 2) Production Image
FROM node:18-alpine

# Install any OS dependencies needed at runtime
RUN apk add --no-cache openssl

# Set working directory
WORKDIR /var/www/estimate-app

# Copy only the necessary build outputs and production dependencies
COPY --from=builder /var/www/estimate-app/package.json /var/www/estimate-app/package-lock.json ./
COPY --from=builder /var/www/estimate-app/.next ./.next
COPY --from=builder /var/www/estimate-app/public ./public
COPY --from=builder /var/www/estimate-app/node_modules ./node_modules

# Expose the port your app runs on
EXPOSE 3000

# Optional Healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/ || exit 1

# Start the application
CMD ["npm", "start"]
