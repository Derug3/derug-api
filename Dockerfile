FROM  node

WORKDIR /usr/src/app

COPY ["./package.json","./package-lock.json","./"]

EXPOSE 3000

COPY . .

RUN npm install
RUN nest build

CMD ["npm","run","start:dev"]
