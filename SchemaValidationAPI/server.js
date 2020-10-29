var express = require('express');
var axios = require('axios');
var app = express();
var validationSchema = require('./validator.json');
var view = require('./validator.json');

app.use(express.static('public'));

app.get('/', async (_, res) => {
  console.log('hey');
  res.send(view);
});

app.get('/dashboardRawSchema', async (_, res) => {
  await axios
    .get('http://localhost:5000/Schema')
    .then((response) => {
      console.log(response.data);
      res.send(response.data);
    })
    .catch((e) => console.log(e));
});

app.get('/dataoutputs', async (req, res) => {
  var dataOutput = require('./public/components/data-outputs-base.json');

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

const parseDashboardSchema = (definitions) => {
  for (let definition in definitions) {
    parseEnum(definitions[definition]);
  }
  parseCalculatedDataPointDto(definitions.DashboardCalculatedDataPointDto);
};

/* 
  NJsonSchema returns x-enumNames key containing the enum values
  The YAML redhat vscode extension doesn't support this key, instead looks for the 'enum' key.
  https://github.com/RicoSuter/NJsonSchema/issues/527 (example)

   - replace x-enum with enum
   - lower first character (to match dashboard yamls)
*/
const parseEnum = (object) => {
  if (Object.getOwnPropertyDescriptor(object, 'x-enumNames')) {
    object['type'] = 'string';
    delete object['enum'];
    var lowerCaseValues = object['x-enumNames'].map((x) => {
      return x.charAt(0).toLowerCase() + x.slice(1);
    });
    object['enum'] = lowerCaseValues;
    delete object['x-enumNames'];
  }
};

//Use anyOf instead of allOf to avoid calculated data point (nested object) errors
const parseCalculatedDataPointDto = (definition) => {
  if (Object.getOwnPropertyDescriptor(definition, 'allOf')) {
    definition['anyOf'] = definition['allOf'];
    delete definition['allOf'];
  }
};

app.listen(8000, () => {
  console.log('listening on 8000');
});
