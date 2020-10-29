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

app.get('/dashboardSchema', async (req, res) => {
  updateSchemaDashboardsService(req, res);
});

const updateSchemaDashboardsService = async (_, res) => {
  var result;
  await axios
    .get('http://localhost:5000/Schema')
    .then((response) => {
      for (let definition in response.data.definitions) {
        parseEnum(response.data.definitions[definition]);
      }
      res.send(response.data.definitions);
    })
    .catch(function (error) {
      console.log(error);
    });
  return result;
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
    delete object['enum'];
    var lowerCaseValues = object['x-enumNames'].map((x) => {
      return x.charAt(0).toLowerCase() + x.slice(1);
    });

    object['x-enumNames'] = lowerCaseValues;

    Object.defineProperty(
      object,
      'enum',
      Object.getOwnPropertyDescriptor(object, 'x-enumNames')
    );

    delete object['x-enumNames'];
  }
};

const updateSchemaDashboardUI = () => {
  // use npm to convert the code (typescript classes from front end - types.ts) into the schema
  // manipulate what is not correct.
};

app.listen(8000, () => {
  console.log('listening on 8000');
});
