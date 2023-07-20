const express = require("express");
require('dotenv').config()
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const xss = require('xss-clean')
const ApiResult = require(`./src/middleware/error/ApiResult`);
const app = express();
const port = process.env.PORT;
const mainRoute = require(`./src/routes/index`)
const apiErrorHandler = require('./src/middleware/error/api-error-handler');
app.use(cors({
  origin: "*",
  method:"*"
}));
app.use(helmet());
app.use(xss());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/', mainRoute);
app.use('/img',express.static('./tmp'))

app.get("/", (req, res, next) => {
  next(ApiResult.success(`Success`));
});

//404 on missing route
app.all("*",(req,res,next)=> {
  next(ApiResult.badRequest(`Main route not found`));
})

// console.log(process.env.DB_NAME);
app.use(apiErrorHandler);
app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
