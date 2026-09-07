const Controller = require("./controller");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const mongoose = require("mongoose");
const createHttpError = require("http-errors");
const { ReviewModel } = require("../../models/review");
const { ProjectModel } = require("../../models/project");
const { ProposalModel } = require("../../models/proposal");
const { UserModel } = require("../../models/user");
const { createReviewSchema } = require("../validators/review.schema");
const {
  getRatingStatsByUserIds,
  withRatingStats,
  toIdString,
} = require("../../../utils/reviewHelpers");

const PUBLIC_USER_SELECT = {
  name: 1,
  role: 1,
  biography: 1,
  skills: 1,
  companyName: 1,
  companyDescription: 1,
  createdAt: 1,
};

function serializeReview(review) {
  const plain =
    typeof review.toObject === "function" ? review.toObject() : { ...review };
  return {
    _id: plain._id,
    project: plain.project,
    proposal: plain.proposal,
    reviewer: plain.reviewer,
    reviewee: plain.reviewee,
    rating: plain.rating,
    comment: plain.comment || "",
    createdAt: plain.createdAt,
  };
}

class ReviewController extends Controller {
  async createReview(req, res) {
    const { projectId, rating, comment } = await createReviewSchema.validateAsync(
      req.body
    );
    const numericRating = Number(rating);
    if (
      !Number.isInteger(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      throw createHttpError.BadRequest("امتیاز باید عددی بین ۱ تا ۵ باشد");
    }

    const project = await ProjectModel.findById(projectId);
    if (!project) throw createHttpError.NotFound("پروژه یافت نشد");

    if (project.status !== "COMPLETED") {
      throw createHttpError.BadRequest(
        "فقط پس از تکمیل پروژه می‌توانید نظر ثبت کنید"
      );
    }

    const reviewerId = String(req.user._id);
    const ownerId = toIdString(project.owner);
    const freelancerId = toIdString(project.freelancer);

    if (!freelancerId) {
      throw createHttpError.BadRequest("فریلنسر این پروژه مشخص نیست");
    }

    let revieweeId = null;
    if (reviewerId === ownerId) {
      revieweeId = freelancerId;
    } else if (reviewerId === freelancerId) {
      revieweeId = ownerId;
    } else {
      throw createHttpError.Forbidden(
        "فقط کارفرما و فریلنسر همین پروژه می‌توانند نظر ثبت کنند"
      );
    }

    if (reviewerId === revieweeId) {
      throw createHttpError.BadRequest("نمی‌توانید برای خودتان نظر ثبت کنید");
    }

    const existing = await ReviewModel.findOne({
      project: project._id,
      reviewer: req.user._id,
    });
    if (existing) {
      const err = createHttpError.BadRequest(
        "شما قبلاً برای این پروژه نظر ثبت کرده‌اید"
      );
      err.code = "ALREADY_REVIEWED";
      throw err;
    }

    let proposalId = project.escrowProposal || null;
    if (!proposalId && (project.proposals || []).length) {
      const accepted = await ProposalModel.findOne({
        _id: { $in: project.proposals },
        user: freelancerId,
        status: 2,
      }).select({ _id: 1 });
      proposalId = accepted?._id || null;
    }

    try {
      const review = await ReviewModel.create({
        project: project._id,
        proposal: proposalId,
        reviewer: req.user._id,
        reviewee: revieweeId,
        rating: numericRating,
        comment: comment || "",
      });

      const populated = await ReviewModel.findById(review._id)
        .populate([
          { path: "reviewer", select: PUBLIC_USER_SELECT },
          { path: "reviewee", select: PUBLIC_USER_SELECT },
          { path: "project", select: { title: 1, status: 1 } },
        ])
        .lean();

      return res.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        data: {
          message: "نظر شما با موفقیت ثبت شد",
          review: serializeReview(populated),
        },
      });
    } catch (error) {
      if (error?.code === 11000) {
        const err = createHttpError.BadRequest(
          "شما قبلاً برای این پروژه نظر ثبت کرده‌اید"
        );
        err.code = "ALREADY_REVIEWED";
        throw err;
      }
      throw error;
    }
  }

  async getReviewsForUser(req, res) {
    const { userId } = req.params;
    if (!mongoose.isValidObjectId(userId)) {
      throw createHttpError.BadRequest("شناسه کاربر صحیح نمیباشد");
    }

    const user = await UserModel.findById(userId)
      .select(PUBLIC_USER_SELECT)
      .lean();
    if (!user) throw createHttpError.NotFound("کاربر یافت نشد");

    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const [reviews, total, statsMap] = await Promise.all([
      ReviewModel.find({ reviewee: userId })
        .populate([
          { path: "reviewer", select: { name: 1, role: 1 } },
          { path: "project", select: { title: 1 } },
        ])
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ReviewModel.countDocuments({ reviewee: userId }),
      getRatingStatsByUserIds([userId]),
    ]);

    const stats = statsMap.get(String(userId)) || {
      averageRating: 0,
      totalReviews: 0,
    };

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        user: withRatingStats(user, statsMap),
        averageRating: stats.averageRating,
        totalReviews: stats.totalReviews,
        reviews: reviews.map(serializeReview),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.max(1, Math.ceil(total / limit)),
        },
      },
    });
  }

  async getReviewsForProject(req, res) {
    const { projectId } = req.params;
    if (!mongoose.isValidObjectId(projectId)) {
      throw createHttpError.BadRequest("شناسه پروژه صحیح نمیباشد");
    }

    const project = await ProjectModel.findById(projectId).select({
      title: 1,
      status: 1,
      owner: 1,
      freelancer: 1,
    });
    if (!project) throw createHttpError.NotFound("پروژه یافت نشد");

    const reviews = await ReviewModel.find({ project: projectId })
      .populate([
        { path: "reviewer", select: { name: 1, role: 1 } },
        { path: "reviewee", select: { name: 1, role: 1 } },
      ])
      .sort({ createdAt: -1 })
      .lean();

    const currentUserId = req.user?._id ? String(req.user._id) : null;
    const myReview = currentUserId
      ? reviews.find((review) => String(review.reviewer?._id) === currentUserId) ||
        null
      : null;

    const ownerId = toIdString(project.owner);
    const freelancerId = toIdString(project.freelancer);
    const canReview =
      Boolean(currentUserId) &&
      project.status === "COMPLETED" &&
      (currentUserId === ownerId || currentUserId === freelancerId) &&
      !myReview;

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        project: {
          _id: project._id,
          title: project.title,
          status: project.status,
        },
        reviews: reviews.map(serializeReview),
        myReview: myReview ? serializeReview(myReview) : null,
        canReview,
      },
    });
  }
}

module.exports = {
  ReviewController: new ReviewController(),
};
