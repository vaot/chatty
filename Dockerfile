FROM elixir:1.6
MAINTAINER Dreamteam

# Install node
RUN curl --silent --location https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get -y install nodejs inotify-tools
RUN curl -o- -L https://yarnpkg.com/install.sh | bash
RUN ln -s $HOME/.yarn/bin/yarn /usr/local/bin

# Create and move into the app dir
RUN mkdir /app
WORKDIR /app

# Install Hex & Rebar
RUN mix local.hex --force && mix local.rebar --force

# Copy configs
COPY mix.exs mix.lock ./
COPY config ./config

RUN mkdir assets
COPY assets/brunch-config.js assets/package.json assets/yarn.lock ./assets/

# Compile Elixir dependencies
RUN mix deps.get --only prod

# Compile JS dependencies
RUN cd assets && yarn install

# Copy the rest of the app over
COPY . .

# Brunch time
RUN cd assets && node node_modules/brunch/bin/brunch build --production

# Complie the app
RUN MIX_ENV=prod mix compile

# Create the digests
RUN MIX_ENV=prod mix phx.digest

# Run phoenix in production on PORT 4289
EXPOSE 4289
