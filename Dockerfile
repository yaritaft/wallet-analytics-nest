FROM node:14.19.0

RUN mkdir /app
WORKDIR /app
ADD ./package.json /app
RUN npm install
ADD . /app