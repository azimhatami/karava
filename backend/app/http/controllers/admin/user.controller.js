const createHttpError = require("http-errors");
const mongoose = require("mongoose");
const { UserModel } = require("../../../models/user");
const Controller = require("../controller");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const { ProjectModel } = require("../../../models/project");
const { ProposalModel } = require("../../../models/proposal");

class UserController extends Controller {
  // ADMIN ROUTES :
  async getAllUsers(req, res) {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const skip = (page - 1) * limit;
    const { search } = req.query;

    // Escape the term: raw user input compiled into a RegExp lets a crafted
    // string break the query or hang the event loop.
    const dbQuery = {};
    if (search && String(search).trim()) {
      const safe = String(search)
        .trim()
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const searchTerm = new RegExp(safe, "i");
      dbQuery.$or = [
        { name: searchTerm },
        { email: searchTerm },
        { phoneNumber: searchTerm },
      ];
    }

    const users = await UserModel.find(dbQuery)
      .limit(limit)
      .skip(skip)
      .sort({
        createdAt: -1,
      });
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        users,
      },
    });
  }
  async userProfile(req, res) {
    const { userId } = req.params;
    if (!mongoose.isValidObjectId(userId)) {
      throw createHttpError.BadRequest("شناسه کاربر صحیح نمیباشد");
    }
    const user = await UserModel.findById(userId, { otp: 0 });
    if (!user) throw createHttpError.NotFound("کاربر یافت نشد");
    const createdProjects = await ProjectModel.find({ owner: userId });
    const completedProjects = await ProjectModel.find({ freelancer: userId });
    const proposals = await ProposalModel.find({ user: userId });

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        user,
        createdProjects,
        completedProjects,
        proposals,
      },
    });
  }
  async verifyUser(req, res) {
    const { userId } = req.params;
    let { status } = req.body;
    status = Number(status);
    if (![0, 1, 2].includes(status)) {
      throw createHttpError.BadRequest("وضعیت ارسال شده صحیح نمیباشد");
    }

    const updateResult = await UserModel.updateOne(
      { _id: userId },
      { $set: { status } }
    );

    // matchedCount: re-applying the status a user already has is not an error
    if (updateResult.matchedCount === 0)
      throw createHttpError.NotFound("کاربر یافت نشد");

    let message = "وضعیت کاربر تایید شد";
    if (status === 0) message = "وضعیت کاربر به حالت رد شده تغییر یافت";
    if (status === 1)
      message = "وضعیت کاربر به حالت در انتظار تایید تغییر یافت";

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message,
      },
    });
  }
}

module.exports = {
  UserController: new UserController(),
};
