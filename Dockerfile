# Base Image
FROM node:20-alpine

# Set a non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup


# set a working directory inside the container
WORKDIR /app 

# cache the dependencies 
COPY api/package.json api/pnpm-lock.yaml ./ 

# install pnpm 
RUN npm install -g pnpm@8.15.3 && pnpm install

# Copy application code to container 
COPY api/ . 

# Expose the necessary port
EXPOSE 3000 

# Use a non-root user to run the application
USER appuser

CMD [ "pnpm", "dev" ]