var express = require("express");
var app = express();
var validationSchema = require('./ValidationSchema/dashboardsSchema.json')

app.get('/dashboardSchema', function(req, res){
    res.send(validationSchema)
});

app.listen(3000, () => {
    console.log('listening on 3000')
});