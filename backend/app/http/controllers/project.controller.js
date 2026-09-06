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
    if (["OPEN", "CLOSED"].includes(status)) {
      dbQuery["status"] = { $eq: status };
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
        owner: 0,
        freelancer: 0,
        proposals: 0,
      })
      .populate([{ path: "category", select: { title: 1, englishTitle: 1 } }])
      .sort(sortQuery);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        projects,
      },
    });
  }
  async getListOfOwnerProjects(req, res) {
    let dbQuery = {};
    const user = req.user;
    dbQuery.owner = user._id;

    const { search, category, sort } = req.query;

    if (search) dbQuery["$text"] = { $search: search };
    if (category) {
      const categories = category.split(",");
      const categoryIds = [];
      for (const item of categories) {
        const { _id } = await CategoryModel.findOne({ englishTitle: item });
        categoryIds.push(_id);
      }
      dbQuery["category"] = {
        $in: categoryIds,
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
      .sort(sortQuery);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        projects,
      },
    });
  }
  async getProjectById(req, res) {
    const { id } = req.params;
    await this.findProjectById(id);
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

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        project,
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
        proposals: 1,
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

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        project: {
          ...project,
          proposalCount,
          ownerProjectCount,
        },
        myProposal,
      },
    });
  }
  async findProjectById(id) {
    if (!mongoose.isValidObjectId(id))
      throw createHttpError.BadRequest("شناسه پروژ ارسال شده صحیح نمیباشد");
    const project = await ProjectModel.findById(id);
    if (!project) throw createHttpError.NotFound("پروژه یافت نشد.");
    return project;
  }
  async changeProjectStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body;

    const updateResult = await ProjectModel.updateOne(
      { _id: id },
      { $set: { status } } // 0, 1, 2
    );

    if (updateResult.modifiedCount === 0)
      throw createHttpError.InternalServerError(" وضعیت پروپوزال آپدیت نشد");

    let message = "پروژه بسته شد";
    if (status === "OPEN") message = "وضعیت پروژه به حالت باز تغییر یافت";

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message,
      },
    });
  }
  async deleteProject(req, res) {
    const { id } = req.params;
    const project = await this.findProjectById(id);

    if (project.freelancer)
      throw createHttpError.BadRequest("پروژه قابل حذف نیست");

    const result = await ProjectModel.deleteOne({ _id: id });
    if (result.deletedCount)
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: {
          message: "پروژه با موفقیت حذف شد",
        },
      });
  }
  async updateProject(req, res) {
    const { id } = req.params;
    await this.findProjectById(id);
    const { title, description, tags, deadline, category, budget } =
      await addProjectSchema.validateAsync(req.body);
    const updateResult = await ProjectModel.updateOne(
      { _id: id },
      {
        $set: { title, description, tags, deadline, category, budget },
      }
    );
    if (updateResult.modifiedCount == 0)
      throw createError.InternalServerError("به روزرسانی انجام نشد");
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
