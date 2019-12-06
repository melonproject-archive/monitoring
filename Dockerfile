# -----------------------------------------------------------------------------
# base
# -----------------------------------------------------------------------------
FROM node:11 as base

RUN wget https://github.com/jwilder/dockerize/releases/download/v0.6.1/dockerize-alpine-linux-amd64-v0.6.1.tar.gz \
  && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-v0.6.1.tar.gz \
  && rm dockerize-alpine-linux-amd64-v0.6.1.tar.gz

# -----------------------------------------------------------------------------
# dependencies
# -----------------------------------------------------------------------------
FROM base as deps
WORKDIR /app

# Install node dependencies and clean up afterwards.
COPY yarn.lock package.json ./
RUN yarn install --ignore-engines --frozen-lockfile --pure-lockfile && \
  yarn cache clean

# -----------------------------------------------------------------------------
# development
# -----------------------------------------------------------------------------
FROM base as development
WORKDIR /app

COPY --from=deps /app/node_modules node_modules
COPY . .

EXPOSE 3000
CMD ["yarn", "dev"]
