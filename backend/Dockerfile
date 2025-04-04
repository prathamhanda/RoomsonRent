FROM node:alpine  
RUN apk add --no-cache git
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN npm install -g pm2
COPY . .  
EXPOSE 5000
CMD ["pm2-runtime", "server.js"]