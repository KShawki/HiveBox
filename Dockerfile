# Base Image
FROM node:20-alpine

# set a working directory inside the container
WORKDIR /app 

# cache the dependencies 
COPY api/package.json api/pnpm-lock.yaml ./ 

# install pnpm 
RUN npm install -g pnpm && pnpm install

COPY api/ . 

EXPOSE 3000 

CMD [ "pnpm", "dev" ]