FROM node:18

# Install TeX Live
RUN apt-get update && \
    apt-get install -y texlive-full && \
    apt-get clean

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN yarn

# Bundle app source
COPY . .

# Expose port and start the application
EXPOSE 3000
CMD [ "yarn", "run", "dev"]
