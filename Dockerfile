# Use Node Alpine
FROM node:22-alpine AS development

# Set working dir
WORKDIR /swapskill/src/app

# Copy package files and install deps
COPY package*.json ./
RUN npm install

# Copy source code (optional if using volumes)
COPY . .

# Expose Angular dev port
EXPOSE 4200

# Start Angular dev server
CMD ["npm", "run", "start"]
