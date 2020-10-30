## Schema Validator API

1- Install packages
```
npm install
```

2- Run the dashboard service locally, using the branch:
https://github.com/seeeverything/service.dashboards/tree/yuri-test-schema

> note: the expected port for the dashboard service is 5000 or process.env.PORT, so run it using this port, otherwise change the dashboardController.js

3- Run the nodejs service (you can use bash/cmd)
>    node server/server.js

or use nodemon, if you have it installed (npm i -g nodemon)
>    nodemon server/server.js

4- test
using vscode, download the extension YAML (from redhat)
add the following configuration to your settings.json
```javascript  
"yaml.schemas": {
    "http://localhost:8000/dashboard": ["/*"]
  },
```

