const Controller = require("./controller");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const createHttpError = require("http-errors");
const path = require("path");
const { UserModel } = require("../../models/user");
const { ProjectModel } = require("../../models/project");
const { saveFile, deleteFile, getFileStreamPath } = require("../../../utils/fileStorage");
const { assertAllowedFile } = require("../../../utils/fileValidation");
const { ROLES } = require("../../../utils/constants");
const MAX_PORTFOLIO = Number(process.env.UPLOAD_MAX_PORTFOLIO || 12);
const MAX_ATTACHMENTS = Number(process.env.UPLOAD_MAX_ATTACHMENTS || 5);
const MAX_DELIVERABLES = Number(process.env.UPLOAD_MAX_DELIVERABLES || 10);

function requireUploadedFile(req) {
  if (!req.file) {
    throw createHttpError.BadRequest("فایل ارسال نشده است");
  }
  return req.file;
}

class FileController extends Controller {
  async uploadPortfolio(req, res) {
    if (req.user.role !== ROLES.FREELANCER && req.user.role !== ROLES.ADMIN) {
      throw createHttpError.Forbidden("فقط فریلنسر می‌تواند نمونه‌کار آپلود کند");
    }

    const file = requireUploadedFile(req);
    const { mimeType } = assertAllowedFile({
      originalName: file.originalname,
      claimedMime: file.mimetype,
      buffer: file.buffer,
      kind: "portfolio",
    });

    const user = await UserModel.findById(req.user._id);
    if (!user) throw createHttpError.NotFound("کاربر یافت نشد");
    if ((user.portfolio || []).length >= MAX_PORTFOLIO) {
      throw createHttpError.BadRequest(
        `حداکثر ${MAX_PORTFOLIO} نمونه‌کار می‌توانید آپلود کنید`
      );
    }

    const stored = await saveFile({
      folder: "portfolio",
      originalName: file.originalname,
      buffer: file.buffer,
      mimeType,
    });

    user.portfolio.push(stored);
    await user.save();

    const item = user.portfolio[user.portfolio.length - 1];

    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      data: {
        message: "نمونه‌کار با موفقیت آپلود شد",
        file: item,
      },
    });
  }

  async deletePortfolio(req, res) {
    const { fileId } = req.params;
    const user = await UserModel.findById(req.user._id);
    if (!user) throw createHttpError.NotFound("کاربر یافت نشد");

    const item = (user.portfolio || []).id(fileId);
    if (!item) throw createHttpError.NotFound("نمونه‌کار یافت نشد");

    const storageKey = item.storageKey;
    user.portfolio.pull(fileId);
    await user.save();
    await deleteFile(storageKey);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: "نمونه‌کار حذف شد",
      },
    });
  }

  async uploadProjectAttachment(req, res) {
    const { projectId } = req.params;
    const project = await ProjectModel.findById(projectId);
    if (!project) throw createHttpError.NotFound("پروژه یافت نشد");

    const isOwner =
      String(project.owner) === String(req.user._id) ||
      req.user.role === ROLES.ADMIN;
    if (!isOwner) {
      throw createHttpError.Forbidden("فقط صاحب پروژه می‌تواند ضمیمه آپلود کند");
    }

    if ((project.attachments || []).length >= MAX_ATTACHMENTS) {
      throw createHttpError.BadRequest(
        `حداکثر ${MAX_ATTACHMENTS} ضمیمه برای هر پروژه مجاز است`
      );
    }

    const file = requireUploadedFile(req);
    const { mimeType } = assertAllowedFile({
      originalName: file.originalname,
      claimedMime: file.mimetype,
      buffer: file.buffer,
      kind: "attachment",
    });

    const stored = await saveFile({
      folder: "attachments",
      originalName: file.originalname,
      buffer: file.buffer,
      mimeType,
    });

    project.attachments.push(stored);
    await project.save();

    const item = project.attachments[project.attachments.length - 1];

    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      data: {
        message: "ضمیمه پروژه با موفقیت آپلود شد",
        file: item,
      },
    });
  }

  async uploadProjectDeliverable(req, res) {
    const { projectId } = req.params;
    const project = await ProjectModel.findById(projectId);
    if (!project) throw createHttpError.NotFound("پروژه یافت نشد");

    const isAssignedFreelancer =
      project.freelancer &&
      String(project.freelancer) === String(req.user._id);
    const isAdmin = req.user.role === ROLES.ADMIN;

    if (!isAssignedFreelancer && !isAdmin) {
      throw createHttpError.Forbidden(
        "فقط فریلنسر پذیرفته‌شده می‌تواند فایل تحویل کار را آپلود کند"
      );
    }

    if ((project.deliverables || []).length >= MAX_DELIVERABLES) {
      throw createHttpError.BadRequest(
        `حداکثر ${MAX_DELIVERABLES} فایل تحویل مجاز است`
      );
    }

    const file = requireUploadedFile(req);
    const { mimeType } = assertAllowedFile({
      originalName: file.originalname,
      claimedMime: file.mimetype,
      buffer: file.buffer,
      kind: "deliverable",
    });

    const stored = await saveFile({
      folder: "deliverables",
      originalName: file.originalname,
      buffer: file.buffer,
      mimeType,
    });

    project.deliverables.push(stored);
    await project.save();

    const item = project.deliverables[project.deliverables.length - 1];

    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      data: {
        message: "فایل تحویل کار با موفقیت آپلود شد",
        file: item,
      },
    });
  }

  async downloadFile(req, res) {
    const folder = req.params.folder;
    const filename = req.params.filename;
    const storageKey = `${folder}/${filename}`;

    const { absolutePath } = await getFileStreamPath(storageKey);

    // Access rules by folder
    if (folder === "portfolio") {
      // public
    } else if (folder === "attachments") {
      if (!req.user) {
        throw createHttpError.Unauthorized("برای دانلود ضمیمه وارد شوید");
      }
    } else if (folder === "deliverables") {
      if (!req.user) {
        throw createHttpError.Unauthorized("برای دانلود فایل تحویل وارد شوید");
      }

      const project = await ProjectModel.findOne({
        "deliverables.storageKey": storageKey,
      }).select({ owner: 1, freelancer: 1 });

      if (!project) throw createHttpError.NotFound("فایل یافت نشد");

      const allowed =
        req.user.role === ROLES.ADMIN ||
        String(project.owner) === String(req.user._id) ||
        (project.freelancer &&
          String(project.freelancer) === String(req.user._id));

      if (!allowed) {
        throw createHttpError.Forbidden("دسترسی به این فایل مجاز نیست");
      }
    } else {
      throw createHttpError.NotFound("فایل یافت نشد");
    }

    // Prefer original name from DB when possible
    let downloadName = filename;
    if (folder === "portfolio") {
      const owner = await UserModel.findOne({
        "portfolio.storageKey": storageKey,
      }).select({ "portfolio.$": 1 });
      downloadName = owner?.portfolio?.[0]?.originalName || filename;
    } else if (folder === "attachments") {
      const project = await ProjectModel.findOne({
        "attachments.storageKey": storageKey,
      }).select({ "attachments.$": 1 });
      downloadName = project?.attachments?.[0]?.originalName || filename;
    } else if (folder === "deliverables") {
      const project = await ProjectModel.findOne({
        "deliverables.storageKey": storageKey,
      }).select({ "deliverables.$": 1 });
      downloadName = project?.deliverables?.[0]?.originalName || filename;
    }

    res.download(absolutePath, path.basename(downloadName));
  }
}

module.exports = {
  FileController: new FileController(),
};
