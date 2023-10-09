FROM node:18

RUN adduser --system --group --no-create-home nonroot

WORKDIR /app

COPY package*.json tsconfig.json ./
COPY src ./src
RUN npm install --ignore-scripts
RUN npm run build


EXPOSE 3000
USER nonroot
CMD [ "node", "dist/main.js" ]
