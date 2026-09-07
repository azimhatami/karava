const expressAsyncHandler = require("express-async-handler");
const { WalletController } = require("../http/controllers/wallet.controller");
const { ROLES } = require("../../utils/constants");
const { authorize } = require("../http/middlewares/permission.guard");

const router = require("express").Router();

router.get(
  "/",
  authorize(ROLES.OWNER, ROLES.FREELANCER, ROLES.ADMIN),
  expressAsyncHandler(WalletController.getWallet)
);
router.post(
  "/deposit",
  authorize(ROLES.OWNER, ROLES.FREELANCER, ROLES.ADMIN),
  expressAsyncHandler(WalletController.deposit)
);

module.exports = {
  walletRoutes: router,
};
