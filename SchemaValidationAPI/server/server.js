const express = require('express');
const app = express();
const router = express.Router();
const port = process.env.port || 8000;

//middleware
const middleware = require('./middleware');
middleware.configureMiddleware(app);

app.get('/', (_, res) => {
  res.sendFile('index.html', { root: __dirname });
});

//routes
const dashboardRoutes = require('../controllers/dashboardController').configureRoutes(
  router
);
app.use('/dashboard', dashboardRoutes);

app.listen(port, () => {
  console.log(`listening on ${port}`);
});
