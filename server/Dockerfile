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

# ---------- Release ----------
FROM builder as release
WORKDIR /app
COPY --from=ts-remover /app ./
CMD ["npm", "run", "start:prod"]