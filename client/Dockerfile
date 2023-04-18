FROM node:16-alpine3.12 as builder
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
COPY tsconfig*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:16-alpine3.12 as ts-remover
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/build ./
RUN npm install --only=production

FROM nginx:stable-alpine as production
ENV NODE_ENV production
# Copy built assets from ts-remover
COPY --from=ts-remover /app /usr/share/nginx/html
# Add your nginx.conf
COPY default.conf.template /etc/nginx/templates/
# Expose port
EXPOSE 80
# Start nginx
CMD ["nginx", "-g", "daemon off;"]