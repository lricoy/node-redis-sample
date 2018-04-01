FROM node:9
WORKDIR /code
ENV PATH=$PATH:/code/node_modules/.bin

# Copy the dependencies lists and install them
COPY package.json package.json
COPY package-lock.json package-lock.json

# Install dependencies
RUN npm install

# Copy the remaining stuff so we can "cache" changes
COPY . .

EXPOSE 8999

ENTRYPOINT [ "npm", "start" ]
