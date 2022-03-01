const express = require('express');
const bodyparser = require('body-parser');
const myReqLogger = require('./Utilities/requestLogger');
const userRoute = require('./Routes/userRoute');
const merchantRoute = require('./Routes/merchantRoute');
const providerRoute = require('./Routes/providerRoute');
const authRoute = require('./Routes/authRoute');

const app = express();
require("./DB/db");
app.use(bodyparser.json());
app.use(myReqLogger);
app.use('/auth', authRoute);
app.use('/user', userRoute);
app.use('/merchant', merchantRoute);
app.use('/provider', providerRoute);

const port = process.env.PORT || 3000;
app.listen(port, () =>{
    console.log(`App running on port ${port} ...`);
});
module.exports = app;