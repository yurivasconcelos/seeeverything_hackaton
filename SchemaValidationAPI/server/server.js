const express = require('express');
const app = express();
const router = express.Router();
const port = process.env.port || 8000;

//middleware
const middleware = require('./middleware');
middleware.configureMiddleware(app);

//routes
const dashboardRoutes = require('../controllers/dashboardController').configureRoutes(router);
app.use('/dashboard', dashboardRoutes)

app.get('/', (_,res) => {
  res.send('Template Validator API 1.0')
})

app.listen(port, () => {
  console.log(`listening on ${port}`);
});
