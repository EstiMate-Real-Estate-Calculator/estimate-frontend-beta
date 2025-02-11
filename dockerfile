# Use the official Node.js image
FROM node:18-alpine as builder

# Install dependencies
RUN apk add --no-cache openssl

# Set working directory inside the container
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./

# Reduce memory usage to prevent build crashes
ENV NODE_OPTIONS="--max-old-space-size=512"

# Use --omit=dev to avoid unnecessary dependencies in production
RUN npm install --omit=dev

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
WORKDIR /app

# Copy necessary files from builder
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
