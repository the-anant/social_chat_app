const express = require("express");
const chatController = require("../../controllers/chat/chat.controllers.js");

const fetchUser = require("../../middleware/fetchUser.js");
const chatValidators = require("../../validators/chat/chat.validators.js");
const mongoValidator = require("../../validators/mongo.validator.js");
// import { mongoIdPathVariableValidator } from "../../../validators/common/mongodb.validators.js";
// import { validate } from "../../../validators/validate.js";
// 
const router = express.Router();
router.use(fetchUser);

router.route("/inbox").get(chatController.getAllChats);

router.route("/users").get(chatController.searchAvailableUsers);

router.route("/c/:receiverId").post(
  mongoValidator.mongoIdPathVariableValidator("receiverId"),

  chatController.createOrGetAOneOnOneChat
);

router

  .route("/group")
  .post(
    chatValidators.createAGroupChatValidator(),
    chatController.createAGroupChat
  );

router
  .route("/group/:chatId")
  .get(
    mongoValidator.mongoIdPathVariableValidator("chatId"),
    chatController.getGroupChatDetails
  )
  .patch(
    mongoValidator.mongoIdPathVariableValidator("chatId"),
    chatValidators.updateGroupChatNameValidator(),

    chatController.renameGroupChat
  )
  .delete(
    mongoValidator.mongoIdPathVariableValidator("chatId"),
    chatController.deleteGroupChat
  );

router
  .route("/group/:chatId/:participantId")
  .post(
    mongoValidator.mongoIdPathVariableValidator("chatId"),
    mongoValidator.mongoIdPathVariableValidator("participantId"),

    chatController.addNewParticipantInGroupChat
  )
  .delete(
    mongoValidator.mongoIdPathVariableValidator("chatId"),
    mongoValidator.mongoIdPathVariableValidator("participantId"),

    chatController.removeParticipantFromGroupChat
  );

router
  .route("/leave/group/:chatId")
  .delete(
    mongoValidator.mongoIdPathVariableValidator("chatId"),
    chatController.leaveGroupChat
  );

router
  .route("/remove/:chatId")
  .delete(
    mongoValidator.mongoIdPathVariableValidator("chatId"),
    chatController.deleteOneOnOneChat
  );

module.exports = router;
