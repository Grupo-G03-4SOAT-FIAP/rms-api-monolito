FROM node:18
WORKDIR /usr/src/RMS-backend-fase01
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install
COPY . .
RUN npm run build
CMD [ "node", "dist/main.js" ]
