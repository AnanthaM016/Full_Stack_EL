# ===============================
# Backend Dockerfile – TeamFinder
# ===============================

# Use lightweight Node.js image
FROM node:18-alpine

# Set working directory inside container
WORKDIR /app

# Copy package files first (enables Docker cache)
COPY package*.json ./

# Install ONLY production dependencies
RUN npm install --only=production

# Copy rest of backend source code
COPY . .

# Expose backend port
EXPOSE 5000

# Start backend server
CMD ["npm", "start"]
