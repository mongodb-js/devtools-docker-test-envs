FROM node:22

ARG MONGODB_VERSION=""

RUN npm install -g mongodb-runner
EXPOSE 27017
RUN echo "Setting up mongodb-runner with ${MONGODB_VERSION}"

CMD ["mongodb-runner", "start"]
