<<<<<<< HEAD
version https://git-lfs.github.com/spec/v1
oid sha256:20caedd8b3a7bd047ac6ef120ea820180099a03a91c0582581a1cba4264e3234
size 401
=======
# Use the official Node.js image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js app
RUN npm run build

# Expose the port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
>>>>>>> 7f1fe6d483b3580b1d12e3b284685f4b1b690054
