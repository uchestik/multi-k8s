FROM node:alpine

WORKDIR '/app'

COPY ./package.json ./
RUN npm install
COPY ./ ./

# generate client build
RUN npm run build

# run stage
FROM nginx
# from specifies the name or index of a build stage

# expose a port
# elastic beanstalk will automatically map this port to the container
EXPOSE 3000

# overwrite nginx basic configs
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

COPY --from=0 /app/build /usr/share/nginx/html
#the default command of nginx starts up nginx