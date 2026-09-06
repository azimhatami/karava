const router = require("express").Router();
const expressAsyncHandler = require("express-async-handler");
const { verifyAccessToken } = require("../http/middlewares/user.middleware");
const { UserAuthController } = require("../http/controllers/userAuth.controller");
const { FileController } = require("../http/controllers/file.controller");
const {
  handleMulterUpload,
  uploadRateLimit,
} = require("../http/middlewares/upload.middleware");

router.post("/get-otp", expressAsyncHandler(UserAuthController.getOtp));
router.post("/check-otp", expressAsyncHandler(UserAuthController.checkOtp));
router.post(
  "/complete-profile",
  verifyAccessToken,
  expressAsyncHandler(UserAuthController.completeProfile)
);
router.get(
  "/refresh-token",
  expressAsyncHandler(UserAuthController.refreshToken)
);
router.patch(
  "/update",
  verifyAccessToken,
  expressAsyncHandler(UserAuthController.updateProfile)
);

router.get(
  "/profile",
  verifyAccessToken,
  expressAsyncHandler(UserAuthController.getUserProfile)
);

router.post(
  "/portfolio/upload",
  verifyAccessToken,
  uploadRateLimit(),
  handleMulterUpload("portfolio"),
  expressAsyncHandler(FileController.uploadPortfolio)
);

router.delete(
  "/portfolio/:fileId",
  verifyAccessToken,
  expressAsyncHandler(FileController.deletePortfolio)
);

router.post("/logout", expressAsyncHandler(UserAuthController.logout));

module.exports = {
  userAuthRoutes: router,
};
