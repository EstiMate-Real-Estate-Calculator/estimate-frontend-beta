# Use the official Node.js image
FROM node:18-alpine as builder

# Set the working directory inside the container
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js app (or your static site)
RUN npm run build

# Use the official Nginx image to serve the site
FROM nginx:alpine

# Copy the built website files from the builder stage
COPY --from=builder /app/out /usr/share/nginx/html

# Copy custom Nginx configuration (if needed)
COPY nginx.conf /etc

# Expose port 80 (default HTTP port for Nginx)
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]