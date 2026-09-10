const Controller = require("./controller");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const mongoose = require("mongoose");
const { CategoryModel } = require("../../models/category");
const { ProjectModel } = require("../../models/project");
const createHttpError = require("http-errors");
const { addProjectSchema } = require("../validators/project.schema");
const { ProposalModel } = require("../../models/proposal");
const ObjectId = mongoose.Types.ObjectId;
const {
  ACTION_TYPES,
  assertProfileCompleteForAction,
} = require("../../../utils/profileCompleteness");
const { ROLES } = require("../../../utils/constants");
const { releaseEscrowOnComplete } = require("../../../utils/walletHelpers");
const {
  getRatingStatsByUserIds,
  withRatingStats,
} = require("../../../utils/reviewHelpers");

class ProjectController extends Controller {
  async addNewProject(req, res) {
    const userId = req.user._id;
    const { title, description, tags, category, budget, deadline } =
      await addProjectSchema.validateAsync(req.body);

    assertProfileCompleteForAction(
      req.user,
      ACTION_TYPES.CREATE_PROJECT,
      "برای ثبت پروژه باید ابتدا پروفایل خود را تکمیل کنید"
    );

    const project = await ProjectModel.create({
      title,
      description,
      tags,
      category,
      budget,
      deadline,
      owner: userId,
    });

    if (!project?._id)
      throw createHttpError.InternalServerError("پروژه ثبت نشد");

    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      data: {
        message: "پروژه با موفقیت ایجاد شد",
        project,
      },
    });
  }
  async getListOfProjects(req, res) {
    let dbQuery = {};
    const { search, category, sort, status } = req.query;

    // SEARCH
    if (search) dbQuery["$text"] = { $search: search };

    // STATUS
    if (["OPEN", "CLOSED", "COMPLETED"].includes(status)) {
      dbQuery["status"] = { $eq: status };
    } else {
      dbQuery["status"] = { $ne: "COMPLETED" };
    }
    // CATEGORY
    if (category && !category.includes("ALL")) {
      const categories = category.split(",");
      const categoryIds = [];
      for (const item of categories) {
        const category = await CategoryModel.findOne({ englishTitle: item });
        if (category) categoryIds.push(category._id);
      }
      dbQuery["category"] = {
        $in: categoryIds,
      };
    }

    // SORT
    const sortQuery = {};
    if (!sort) sortQuery["createdAt"] = 1;
    if (sort) {
      if (sort === "latest") sortQuery["createdAt"] = -1;
      if (sort === "earliest") sortQuery["createdAt"] = 1;
    }

    const projects = await ProjectModel.find(dbQuery)
      .select({
        freelancer: 0,
        proposals: 0,
      })
      .populate([
        { path: "category", select: { title: 1, englishTitle: 1 } },
        { path: "owner", select: { name: 1 } },
      ])
      .sort(sortQuery)
      .lean();

    const ratingMap = await getRatingStatsByUserIds(
      projects.map((project) => project.owner?._id)
    );
    const projectsWithRatings = projects.map((project) => ({
      ...project,
      owner: project.owner
        ? withRatingStats(project.owner, ratingMap)
        : project.owner,
    }));

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        projects: projectsWithRatings,
      },
    });
  }
  async getListOfOwnerProjects(req, res) {
    let dbQuery = {};
    const user = req.user;
    dbQuery.owner = user._id;

    const { search, category, sort } = req.query;

    if (search) dbQuery["$text"] = { $search: search };
    if (category && !category.includes("ALL")) {
      const categories = category.split(",");
      const found = await CategoryModel.find({
        englishTitle: { $in: categories },
      }).select({ _id: 1 });
      dbQuery["category"] = {
        $in: found.map((item) => item._id),
      };
    }

    const sortQuery = {};
    if (!sort) sortQuery["createdAt"] = 1;
    if (sort) {
      if (sort === "latest") sortQuery["createdAt"] = -1;
      if (sort === "earliest") sortQuery["createdAt"] = 1;
      if (sort === "popular") sortQuery["likes"] = -1;
    }

    const projects = await ProjectModel.find(dbQuery)
      .populate([
        { path: "category", select: { title: 1, englishTitle: 1 } },
        { path: "owner", select: { name: 1 } },
        { path: "freelancer", select: { name: 1 } },
      ])
      .sort(sortQuery)
      .lean();

    const ratingMap = await getRatingStatsByUserIds(
      projects.flatMap((project) => [
        project.owner?._id,
        project.freelancer?._id,
      ])
    );
    const projectsWithRatings = projects.map((project) => ({
      ...project,
      owner: project.owner
        ? withRatingStats(project.owner, ratingMap)
        : project.owner,
      freelancer: project.freelancer
        ? withRatingStats(project.freelancer, ratingMap)
        : project.freelancer,
    }));

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        projects: projectsWithRatings,
      },
    });
  }
  async getProjectById(req, res) {
    const { id } = req.params;
    const existing = await this.findProjectById(id);
    this.assertProjectOwnership(existing, req.user);
    const project = await ProjectModel.findById(id).populate([
      {
        path: "category",
        model: "Category",
        select: {
          title: 1,
          englishTitle: 1,
        },
      },
      {
        path: "proposals",
        model: "Proposal",
        populate: [
          {
            path: "user",
            model: "User",
            select: { name: 1 },
          },
        ],
      },
      {
        path: "owner",
        model: "User",
        select: { name: 1 },
      },
      {
        path: "freelancer",
        model: "User",
        select: { name: 1 },
      },
    ]);

    const { ConversationModel } = require("../../models/conversation");
    const acceptedIds = (project.proposals || [])
      .filter((p) => Number(p.status) === 2)
      .map((p) => p._id);
    const conversations = acceptedIds.length
      ? await ConversationModel.find({ proposal: { $in: acceptedIds } })
          .select({ proposal: 1 })
          .lean()
      : [];
    const conversationByProposal = new Map(
      conversations.map((c) => [String(c.proposal), String(c._id)])
    );

    const projectObj = project.toObject();
    const ratingUserIds = [
      projectObj.owner?._id,
      projectObj.freelancer?._id,
      ...(projectObj.proposals || []).map((proposal) => proposal.user?._id),
    ];
    const ratingMap = await getRatingStatsByUserIds(ratingUserIds);

    projectObj.owner = projectObj.owner
      ? withRatingStats(projectObj.owner, ratingMap)
      : projectObj.owner;
    projectObj.freelancer = projectObj.freelancer
      ? withRatingStats(projectObj.freelancer, ratingMap)
      : projectObj.freelancer;
    projectObj.proposals = (projectObj.proposals || []).map((proposal) => ({
      ...proposal,
      conversationId:
        conversationByProposal.get(String(proposal._id)) || null,
      user: proposal.user
        ? withRatingStats(proposal.user, ratingMap)
        : proposal.user,
    }));

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        project: projectObj,
      },
    });
  }

  async getPublicProjectDetails(req, res) {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      throw createHttpError.BadRequest("شناسه پروژه ارسال شده صحیح نمیباشد");
    }

    const project = await ProjectModel.findById(id)
      .select({
        title: 1,
        description: 1,
        status: 1,
        budget: 1,
        tags: 1,
        deadline: 1,
        createdAt: 1,
        category: 1,
        owner: 1,
        freelancer: 1,
        proposals: 1,
        attachments: 1,
        deliverables: 1,
      })
      .populate([
        {
          path: "category",
          select: { title: 1, englishTitle: 1 },
        },
        {
          path: "owner",
          select: { name: 1, companyName: 1, companyDescription: 1 },
        },
      ])
      .lean();

    if (!project) throw createHttpError.NotFound("پروژه یافت نشد.");

    const proposalIds = project.proposals || [];
    const proposalCount = proposalIds.length;

    const ownerProjectCount = project.owner?._id
      ? await ProjectModel.countDocuments({ owner: project.owner._id })
      : 0;

    let myProposal = null;
    const currentUser = req.user;
    if (currentUser && proposalIds.length) {
      myProposal = await ProposalModel.findOne({
        _id: { $in: proposalIds },
        user: currentUser._id,
      })
        .select({
          status: 1,
          price: 1,
          duration: 1,
          durationUnit: 1,
          description: 1,
          createdAt: 1,
        })
        .lean();
    }

    delete project.proposals;

    const currentUserId = currentUser?._id ? String(currentUser._id) : null;
    const isOwner =
      currentUserId &&
      project.owner?._id &&
      String(project.owner._id) === currentUserId;
    const isAssignedFreelancer =
      currentUserId &&
      project.freelancer &&
      String(project.freelancer) === currentUserId;
    const canSeeDeliverables =
      currentUser?.role === "ADMIN" || isOwner || isAssignedFreelancer;

    const attachments = (project.attachments || []).map((file) => ({
      _id: file._id,
      originalName: file.originalName,
      mimeType: file.mimeType,
      size: file.size,
      url: file.url,
      uploadedAt: file.uploadedAt,
    }));

    const deliverables = canSeeDeliverables
      ? (project.deliverables || []).map((file) => ({
          _id: file._id,
          originalName: file.originalName,
          mimeType: file.mimeType,
          size: file.size,
          url: file.url,
          uploadedAt: file.uploadedAt,
        }))
      : [];

    delete project.attachments;
    delete project.deliverables;
    delete project.freelancer;

    const ownerRatingMap = await getRatingStatsByUserIds([
      project.owner?._id,
    ]);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        project: {
          ...project,
          owner: project.owner
            ? withRatingStats(project.owner, ownerRatingMap)
            : project.owner,
          attachments,
          deliverables,
          proposalCount,
          ownerProjectCount,
          isOwner: Boolean(isOwner),
          isAssignedFreelancer: Boolean(isAssignedFreelancer),
        },
        myProposal,
      },
    });
  }
  async findProjectById(id) {
    if (!mongoose.isValidObjectId(id))
      throw createHttpError.BadRequest("شناسه پروژه ارسال شده صحیح نمیباشد");
    const project = await ProjectModel.findById(id);
    if (!project) throw createHttpError.NotFound("پروژه یافت نشد.");
    return project;
  }
  /**
   * Role alone is not enough: an OWNER must own the project it acts on,
   * otherwise any logged-in owner could read/edit/delete anyone's project.
   */
  assertProjectOwnership(project, user) {
    if (user.role === ROLES.ADMIN) return;
    if (String(project.owner) !== String(user._id)) {
      throw createHttpError.Forbidden("شما به این پروژه دسترسی ندارید");
    }
  }
  async changeProjectStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body;

    if (!["OPEN", "CLOSED"].includes(status)) {
      throw createHttpError.BadRequest("وضعیت پروژه نامعتبر است");
    }

    const project = await this.findProjectById(id);
    if (project.status === "COMPLETED") {
      throw createHttpError.BadRequest(
        "پروژه تکمیل‌شده قابل باز یا بسته کردن نیست"
      );
    }

    const isAdmin = req.user.role === ROLES.ADMIN;
    if (!isAdmin && String(project.owner) !== String(req.user._id)) {
      throw createHttpError.Forbidden("شما اجازه تغییر این پروژه را ندارید");
    }

    const updateResult = await ProjectModel.updateOne(
      { _id: id, status: { $ne: "COMPLETED" } },
      { $set: { status } }
    );

    if (updateResult.modifiedCount === 0)
      throw createHttpError.InternalServerError("وضعیت پروژه آپدیت نشد");

    let message = "پروژه بسته شد";
    if (status === "OPEN") message = "وضعیت پروژه به حالت باز تغییر یافت";

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message,
      },
    });
  }
  async completeProject(req, res) {
    const { id } = req.params;
    const project = await this.findProjectById(id);

    if (
      req.user.role !== ROLES.ADMIN &&
      String(project.owner) !== String(req.user._id)
    ) {
      throw createHttpError.Forbidden(
        "فقط کارفرمای پروژه می‌تواند آن را تکمیل کند"
      );
    }

    const { amount } = await releaseEscrowOnComplete({
      ownerId: project.owner,
      project,
    });

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: "پروژه تکمیل شد و مبلغ به کیف پول فریلنسر واریز گردید",
        amount,
      },
    });
  }
  async deleteProject(req, res) {
    const { id } = req.params;
    const project = await this.findProjectById(id);
    this.assertProjectOwnership(project, req.user);

    if (project.freelancer)
      throw createHttpError.BadRequest("پروژه قابل حذف نیست");

    if (project.escrowStatus === "held")
      throw createHttpError.BadRequest(
        "برای این پروژه مبلغی در حالت انتظار است و قابل حذف نیست"
      );

    const result = await ProjectModel.deleteOne({ _id: id });
    if (!result.deletedCount)
      throw createHttpError.InternalServerError("حذف پروژه انجام نشد");

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: "پروژه با موفقیت حذف شد",
      },
    });
  }
  async updateProject(req, res) {
    const { id } = req.params;
    const project = await this.findProjectById(id);
    this.assertProjectOwnership(project, req.user);
    if (project.status === "COMPLETED") {
      throw createHttpError.BadRequest("پروژه تکمیل‌شده قابل ویرایش نیست");
    }
    const { title, description, tags, deadline, category, budget } =
      await addProjectSchema.validateAsync(req.body);
    const updateResult = await ProjectModel.updateOne(
      { _id: id },
      {
        $set: { title, description, tags, deadline, category, budget },
      }
    );
    // matchedCount, not modifiedCount: resubmitting identical values is not an error
    if (updateResult.matchedCount === 0)
      throw createHttpError.InternalServerError("به روزرسانی انجام نشد");
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: "به روز رسانی با موفقیت انجام شد",
      },
    });
  }
}

module.exports = {
  ProjectController: new ProjectController(),
};
