//todo: use ES6 imports
const express = require('express');
const app = express();

//middleware
const middleware = require('./middleware');
middleware.configureMiddleware(app);

//routes
const dashboardController = require('./controllers/dashboardController');
app.use('/dashboards', dashboardController)



app.listen(8000, () => {
  console.log('listening on 8000');
});
