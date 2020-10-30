const axios = require('axios');
const validator = require('../validators/dashboardValidator.json');
const baseSchema = require('../public/components/data-outputs-base.json');
const dashboardParser = require('../parsers/dashboard-parser');
const dashboardUrl = process.env.DASHBOARDURL || 'http://localhost:5000';


var Validator = require('jsonschema').Validator;
var v = new Validator();
const fs = require('fs'); 

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

  router.get('/validate', (_,res) => {
    fs.readFile('../ToBeValidated.yaml', (err, data) => {
      var x = v.validate(data, schema)
      fs.writeFileSync('./test.json', JSON.stringify(x.errors))
      res.send(x)
    });
  })

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


var schema = {
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "dashboard-validator",
  "type": "array",
  "items": {
    "$id": "#/items",
    "anyOf": [
      {
        "$id": "#/items/anyOf/0",
        "type": "object",
        "title": "Dashboard Validator Schema",
        "description": "Validates Dashboard YAML",
        "default": {},
        "additionalItems": true,
        "properties": {
          "header": {
            "$ref": "./header.json#/definitions/header"
          },
          "section": {
            "$ref": "./section.json#/definitions/section"
          },
          "grid": {
            "$ref": "./grid.json#/definitions/grid"
          },
          "data-outputs": {
            "$ref": "./dashboard/backendSchema#/definitions/data-outputs"
          }
        }
      }
    ],
    "additionalItems": true
  }
}
