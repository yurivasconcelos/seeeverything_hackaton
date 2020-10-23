var express = require('express');
var axios = require('axios');
var app = express();
var validationSchema = require('./validator.json');
var view = require('./view.json');
const { response } = require('express');

app.use(express.static('public'));

// //root of our application
// app.get('/', async (req, res) => {
//   var schemaManipulated = await updateSchemaDashboardsService();
//   res.json(schemaManipulated.data);
// });


//root of our application
app.get('/', async (req, res) => {
  res.send(view)
});


const updateSchemaDashboardsService = async () => {
  // fetch schema from the new end-point in the dashboard service
  // manipulate a few things regarding the enums, and the calculated data points that are wrong.
  // lower case all the enums as well
  // update the validator.json
  // add to the base string.
  var result;
  await axios
    .get('http://localhost:5000/Schema')
    .then((response) => {
      for (let definition in response.data.definitions) {
        renameKey(response.data.definitions[definition]);
      }
      result = response;
    })
    .catch(function (error) {
      console.log(error);
    });
  return result;
};

const renameKey = (object) => {
  if (Object.getOwnPropertyDescriptor(object, 'x-enumNames')) {
    delete object['enum'];

    
    //the dashboard templates uses the first character as lower case.
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
