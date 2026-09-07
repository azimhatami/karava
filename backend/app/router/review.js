const expressAsyncHandler = require("express-async-handler");
const { ReviewController } = require("../http/controllers/review.controller");
const { ROLES } = require("../../utils/constants");
const { authorize } = require("../http/middlewares/permission.guard");

const router = require("express").Router();

router.post(
  "/",
  authorize(ROLES.OWNER, ROLES.FREELANCER, ROLES.ADMIN),
  expressAsyncHandler(ReviewController.createReview)
);

module.exports = {
  reviewRoutes: router,
};
