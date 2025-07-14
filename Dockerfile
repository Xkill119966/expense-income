FROM node:lts-alpine AS builder

ENV NODE_ENV=development

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
COPY prisma ./prisma/
COPY libs/common/package*.json ./libs/common/

RUN npm install --production=false

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Production image
FROM node:lts-alpine AS production

# Set working directory
WORKDIR /app

# Copy only necessary files from the builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/libs/common/dist ./libs/common
COPY --from=builder /app/libs/common/dist ./libs/common/dist
COPY --from=builder /app/node_modules ./node_modules

# Expose the application port
EXPOSE 8088

# Run the application
CMD ["sh", "-c", "npm run db:deploy && npm run start"]