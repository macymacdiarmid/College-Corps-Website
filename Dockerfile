FROM node:20-alpine

WORKDIR /app

# Copy backend package files and install dependencies
COPY backend/package*.json ./
RUN npm install

# Copy backend source and build
COPY backend/ ./
RUN npm run build

EXPOSE 3001

CMD ["node", "dist/index.js"]
