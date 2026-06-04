# ============================
# Etapa 1: Dependencias (con Bun)
# ============================
FROM oven/bun:1.2.11-slim AS deps

WORKDIR /app

# Copiamos el proyecto
COPY . .

# Instalamos dependencias con Bun
RUN bun install

# ============================
# Etapa 2: Build (con Nest)
# ============================
FROM node:20-slim AS build

WORKDIR /app

# Copiamos el proyecto y node_modules generados por Bun
COPY . .
COPY --from=deps /app/node_modules ./node_modules

# Ejecutamos el build con Nest (script en package.json)
RUN npm run build


# Stage 3: Production image
FROM gcr.io/distroless/nodejs20-debian11

# Set environment variables
ENV PORT=3000

# Set the working directory
WORKDIR /app

# Copy necessary files from the build stage

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules

EXPOSE ${PORT}

CMD [ "dist/main.js" ]
