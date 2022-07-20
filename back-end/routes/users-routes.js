const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users-controller");
const { check } = require("express-validator");
const checkAuth = require("../middlewares/check-auth");
const fileUpload = require("../middlewares/file-upload");

router.use(checkAuth);
router.get("/getUserById", usersController.getUserById);
router.post(
  "/updatePersonalInformation",
  [check("firstname").not().isEmpty(), check("lastname").not().isEmpty()],
  usersController.updatePersonalInformation
);
router.post(
  "/updateAccountInformation",
  [
    check("receiveNotifications").not().isEmpty(),
    check("receivePromotions").not().isEmpty(),
  ],
  usersController.updateAccountInformation
);

module.exports = router;
