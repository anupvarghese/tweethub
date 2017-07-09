FROM node:latest

MAINTAINER Anoop Varghese <anoop@bouncer.io>

WORKDIR /usr/src/app
COPY ./package.json /usr/src/app
COPY ./yarn.lock /usr/src/app
RUN yarn

ADD . /usr/src/app
