const axios = require('axios');
const validator = require('../validators/dashboardValidator.json');
const baseSchema = require('../public/components/data-outputs-base.json');
const dashboardParser = require('../parsers/dashboard-parser');
const dashboardUrl = process.env.DASHBOARDURL || 'http://localhost:5000';

const configureRoutes = (router) => {
  router.get('/', (_, res) => {
    res.send(validator);
  });

  router.get('/backendSchemaRaw', async (_, res) => {
    const schema = await fetchDashboardServiceSchema(dashboardUrl);
    res.send(schema);
  });

  router.get('/backendSchema', async (_, res) => {
    const schema = await fetchDashboardServiceSchema(dashboardUrl);
    const backendSchema = replaceSchemaWithBase(baseSchema, schema);
    res.send(backendSchema);
  });

  router.get('/frontendSchema', async (_, res) => {
    res.send('front-end schema not available yet');
  });

  return router;
};

const replaceSchemaWithBase = (base, schema) => {
  var dataOutput = { ...base };
  dataOutput.definitions['data-outputs'].items.properties = schema.properties;
  dataOutput.definitions = {
    ...dataOutput.definitions,
    ...schema.definitions,
  };
  return dataOutput;
};

const fetchDashboardServiceSchema = async (url) => {
  const response = await axios.get(`${url}/Schema`);
  dashboardParser.parse(response.data.definitions);
  return response.data;
};

module.exports = {
  configureRoutes,
};
