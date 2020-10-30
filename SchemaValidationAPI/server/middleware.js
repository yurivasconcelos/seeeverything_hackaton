const express = require('express')

const configureMiddleware = (app) => {
  console.log('configuring middleware')

  app.use(express.static('../public/components'));

  //cors
  app.use((_, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
  });

  //body-parser
  app.use(express.json());
};

module.exports = { configureMiddleware };
