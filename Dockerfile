# Build stage
FROM node:18-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

# Production stage
FROM nginx:stable-alpine

COPY --from=build /app/build /usr/share/nginx/html

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Add nginx config to serve React app and proxy API requests
COPY nginx.conf /etc/nginx/conf.d/result-portal.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
