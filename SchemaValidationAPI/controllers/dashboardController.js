const express = require('express');
const axios = require('axios');
const router = express.Router();
const validator = require('../validators/dashboardValidator.json');

const parseDashboardSchema = require('../parsers/dashboard-parser')
  .parseDashboardSchema;

router.get('/', (req, res) => {
  res.send(validator);
});

router.get('/rawSchema', async (_, res) => {
  await axios
    .get('http://localhost:5000/schema')
    .then((response) => {
      console.log(response.data);
      res.send(response.data);
    })
    .catch((e) => console.log(e));
});

router.get('/schema', async (req, res) => {
  var dataOutput = require('../public/components/data-outputs-base.json');

  fetchDashboardSchema(req, res).then((schema) => {
    dataOutput.definitions['data-outputs'].items.properties = schema.properties;
    dataOutput.definitions = {
      ...dataOutput.definitions,
      ...schema.definitions,
    };
    res.send(dataOutput);
  });
});

const fetchDashboardSchema = async (_, res) => {
  return await axios
    .get('http://localhost:5000/Schema')
    .then((response) => {
      parseDashboardSchema(response.data.definitions);
      return response.data;
    })
    .catch(function (error) {
      res.send(error);
    });
};

module.exports = router;
