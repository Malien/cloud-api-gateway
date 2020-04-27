# Base image
FROM node:12 AS base
WORKDIR /usr/motum/api-gateway
COPY package.json .

# Dependancies image
FROM base AS deps
COPY yarn.lock .
COPY .env .
RUN yarn install --prod
RUN cp -R node_modules prod_node_modules
RUN yarn install

# Builder image
FROM deps AS build
COPY . .
RUN yarn build prod

# Production image
FROM base AS release
LABEL maintainer="Yaroslav Petryk"
LABEL description="API Gateway for the motum services"
LABEL version="0.1.0"

COPY .env.example .
COPY .env .
COPY --from=build /usr/motum/api-gateway/out ./out
COPY --from=deps /usr/motum/api-gateway/prod_node_modules ./node_modules

EXPOSE 5507
CMD ["yarn", "start"]
