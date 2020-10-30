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
    fetchDashboardServiceSchema(dashboardUrl).then((schema) => {
      res.send(schema);
    });
  });

  router.get('/backendSchema', async (_, res) => {
    fetchDashboardServiceSchema(dashboardUrl).then((schema) => {
      const backendSchema = replaceSchemaWithBase(baseSchema, schema);
      res.send(backendSchema);
    });
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
  return await axios
    .get(`${url}/Schema`)
    .then((response) => {
      parseDashboardSchema.parse(response.data.definitions);
      return response.data;
    })
    .catch((error) => {
      return error;
    });
};

module.exports = {
  configureRoutes,
};
