# PasswordCheck

## Technologies and Info

PasswordCheck aims to help the user create a strong password. The app includes checks for password length, special characters, common words, upper/lower case letters and numbers. To increase security the app also utilizes Twitter and the users pervious passwords as gating points.

This app is built with [React](https://facebook.github.io/react/) on the client side, [Express](https://expressjs.com/) on the back-end and Redis for light data storage.

Link to App: [PASSWORD CHECK](https://passwordcheck.herokuapp.com/)

## Installation for Mac OS

* Skip if you have redis and node.js

This app uses Redis and Node.js you will need Brew to install

If you DONT have brew, Redis, or Node:
First: If you do not have Brew start here [Brew](https://brew.sh/)

second:

```
brew install redis
```
```
brew install node
```

## Installation for PC

* Skip if you have redis and node.js

This app uses Redis and Node.js, you will need to follow the steps below:

First: Use the [node-installer](https://nodejs.org/en/download/) to and install the correct package.

Second: You will need to download [Redis](https://redis.io/download) and follow the Installation instructions.

## If you HAVE Brew, Redis and Node:

Run the following:
```
npm install
```

```
redis-server
```

Start the webpack and watch for changes:
```
npm run dev
```

Start the App:
```
npm run start
```

Open up the browser and use: [localhost:3000](localhost:3000)
