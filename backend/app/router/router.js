const expressAsyncHandler = require("express-async-handler");
const { ROLES } = require("../../utils/constants");
const { authorize } = require("../http/middlewares/permission.guard");
const {
  verifyAccessToken,
  isVerifiedUser,
  optionalAuthMiddleware,
} = require("../http/middlewares/user.middleware");
const { ProjectController } = require("../http/controllers/project.controller");
const { FileController } = require("../http/controllers/file.controller");
const { adminRoutes } = require("./admin/admin.routes");
const { categoryRoutes } = require("./category");
const { projectRoutes } = require("./project");
const { proposalRoutes } = require("./proposal");
const { userAuthRoutes } = require("./userAuth");

const router = require("express").Router();

router.use("/user", userAuthRoutes);
router.use("/category", categoryRoutes);

// Public / auth-aware file download (access rules enforced in controller)
router.get(
  "/files/:folder/:filename",
  optionalAuthMiddleware,
  expressAsyncHandler(FileController.downloadFile)
);

// Public: open project listing for guests (Home page)
router.get(
  "/project/list",
  expressAsyncHandler(ProjectController.getListOfProjects)
);

// Public: project details (optional auth to include current user's proposal)
router.get(
  "/project/details/:id",
  optionalAuthMiddleware,
  expressAsyncHandler(ProjectController.getPublicProjectDetails)
);

router.use(
  "/project",
  verifyAccessToken,
  isVerifiedUser,
  projectRoutes
);
router.use("/proposal", verifyAccessToken, isVerifiedUser, proposalRoutes);
router.use(
  "/admin",
  verifyAccessToken,
  isVerifiedUser,
  authorize(ROLES.ADMIN),
  adminRoutes
);

module.exports = {
  allRoutes: router,
};
