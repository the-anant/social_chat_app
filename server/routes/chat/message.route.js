const express = require("express");
const messageControllers = require("../../controllers/chat/message.controllers.js");

const fetchUser = require("../../middleware/fetchUser.js");
const upload = require("../../middleware/multer.middleware.js");
const mongoValidator = require("../../validators/mongo.validator.js");
const sendMessageValidator=require('../../validators/chat/message.validators.js')
const validator = require("../../validators/validate.js");

const router = express.Router();

router.use(fetchUser);

router
  .route("/:chatId")
  .get(mongoValidator.mongoIdPathVariableValidator("chatId"), validator, messageControllers.getAllMessages)
  .post(
    upload.fields([{ name: "attachments", maxCount: 5 }]),
    mongoValidator.mongoIdPathVariableValidator("chatId"),
    sendMessageValidator(),
    validator,
    messageControllers.sendMessage
  );

//Delete message route based on Message id

router
  .route("/:chatId/:messageId")
  .delete(
    mongoValidator.mongoIdPathVariableValidator("chatId"),
    mongoValidator.mongoIdPathVariableValidator("messageId"),
    validator,
    messageControllers.deleteMessage
  );
module.exports = router;
