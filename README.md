# Node Express Starter
A quick starter kit for building REST APIs using NodeJS, Express and MongoDB. 
Includes babel for compiling and Jest for testing.

> :warning: **MongoDB**: You should have it installed locally or have an online instance available!

### Install
navigate to your cloned directory and copy `.env-copy` to `.env` and modify accordingly.

Next run the the install command
```bash
npm install 
```

### Scripts

** Development mode **
```bash
npm run dev
```

** Serve Production build **
```bash
npm run serve
```

** Tests **
```bash
npm run test
```

> Often times the test will fail on the `encryption.test.js` seems to be due to bcrypt. Still investigating on the issue

or if you have `jest` installed globally, you can the tests using.

```bash
jest --watchAll
```