const express = require('express')

const configureMiddleware = (app) => {
  app.use(express.static('public'));

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
