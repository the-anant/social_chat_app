const {validationResult}=require('express-validator')
// const {errorHandler} =require('.')
// import { errorHandler } from "../middlewares/error.middlewares.js";

// const ApiError=require('../utils/ApiError.js')
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.path]: err.msg }));

  // 422: Unprocessable Entity
  throw new Error(422, "Received data is not valid", extractedErrors);
};

module.exports=validate;