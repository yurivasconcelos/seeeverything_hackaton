const axios = require('axios');
const validator = require('../validators/dashboardValidator.json');
const dashboardUrl = 'http://localhost:5000';

const configureRoutes = (router) => {
  const parseDashboardSchema = require('../parsers/dashboard-parser')
    .parseDashboardSchema;

  router.get('/', (_, res) => {
    res.send(validator);
  });

  router.get('/backendSchemaRaw', async (_, res) => {
    fetchDashboardServiceSchema(dashboardUrl).then((result) => {
      res.send(result);
    });
  });

  router.get('/backendSchema', async (_, res) => {
    var baseSchema = require('../public/components/data-outputs-base.json');
    fetchDashboardServiceSchema(dashboardUrl).then((backEndSchema) => {
      const dataOutputSchema = replaceSchemaWithBase(baseSchema, backEndSchema);
      res.send(dataOutputSchema);
    });
  });

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
        parseDashboardSchema(response.data.definitions);
        return response.data;
      })
      .catch((error) => {
        return error;
      });
  };
  return router;
};

module.exports = {
  configureRoutes,
};
