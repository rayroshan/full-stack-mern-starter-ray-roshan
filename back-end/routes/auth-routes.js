const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth-controller");
const { check } = require("express-validator");
const checkAuth = require("../middlewares/check-auth");

router.post(
  "/signup",
  [
    check("firstname").not().isEmpty(),
    check("lastname").not().isEmpty(),
    check("phoneNumber").not().isEmpty(),
    check("email")
      .normalizeEmail({
        gmail_remove_dots: false,
      })
      .isEmail(),
    check("password").isLength({ min: 8 }),
  ],
  authController.signup
);

router.post(
  "/signin",
  [
    check("phoneNumber").not().isEmpty(),
    check("password").isLength({ min: 8 }),
  ],
  authController.signin
);

router.post("/verifySMS", authController.verifySMS);
router.get("/sendVerification", authController.sendVerification);
router.post("/verifyEmail", authController.verifyEmail);

router.post(
  "/resetPassword",
  [
    check("email")
      .normalizeEmail({
        gmail_remove_dots: false,
      })
      .isEmail(),
  ],
  authController.resetPassword
);

router.post(
  "/validate",
  [
    check("newPassword").isLength({ min: 8 }),
    check("confirmPassword").isLength({ min: 8 }),
  ],
  authController.validatePassword
);

router.use(checkAuth);
router.post(
  "/changePassword",
  [
    check("oldPassword").isLength({ min: 8 }),
    check("newPassword").isLength({ min: 8 }),
    check("confirmPassword").isLength({ min: 8 }),
  ],
  authController.changePassword
);

module.exports = router;
