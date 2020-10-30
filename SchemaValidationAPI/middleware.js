const express = require('express')

const configureMiddleware = (app) => {
  console.log('configuring middleware')

  app.use(express.static('public/components'));

  app.use((_, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
  });

  app.use(express.json());
};

module.exports = { configureMiddleware };
