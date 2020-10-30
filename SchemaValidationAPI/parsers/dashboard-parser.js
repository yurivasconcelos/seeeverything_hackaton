const parse = (definitions) => {
  for (let definition in definitions) {
    parseEnum(definitions[definition]);
  }
  parseCalculatedDataPointDto(definitions.DashboardCalculatedDataPointDto);
};

/* 
    NJsonSchema returns x-enumNames key so it needs to be parsed
    https://github.com/RicoSuter/NJsonSchema/issues/527
  
     > replace x-enum with enum
     > lower first character (to match dashboard yamls)
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

module.exports = {
  parse,
};
