const Controller = require("./controller");
const {
  generateRandomNumber,
  toPersianDigits,
  buildAuthCookieOptions,
  setAccessToken,
  setRefreshToken,
  verifyRefreshToken,
} = require("../../../utils/functions");
const createError = require("http-errors");
const { UserModel } = require("../../models/user");
const Kavenegar = require("kavenegar");
const CODE_EXPIRES = 90 * 1000; //90 seconds in miliseconds
const { StatusCodes: HttpStatus } = require("http-status-codes");
const {
  completeProfileSchema,
  updateProfileSchema,
  checkOtpSchema,
  getOtpSchema,
} = require("../validators/user.schema");

const DEV_OTP = "111111";
const isDevelopment = () => process.env.NODE_ENV === "development";

class userAuthController extends Controller {
  async getOtp(req, res) {
    const { phoneNumber } = await getOtpSchema.validateAsync(req.body);

    // Per-request local, never instance state: this controller is a singleton,
    // so two users requesting an OTP at the same time used to overwrite
    // each other's code.
    const code = isDevelopment() ? Number(DEV_OTP) : generateRandomNumber(6);

    const result = await this.saveUser(phoneNumber, code);
    if (!result) throw createError.Unauthorized("ورود شما انجام نشد.");

    if (isDevelopment()) {
      console.log(
        `OTP در محیط development: ${DEV_OTP} (NODE_ENV=${process.env.NODE_ENV})`
      );
      return res.status(HttpStatus.OK).send({
        statusCode: HttpStatus.OK,
        data: {
          message: `کد تائید برای شماره موبایل ${toPersianDigits(
            phoneNumber
          )} ارسال گردید (حالت توسعه)`,
          expiresIn: CODE_EXPIRES,
          phoneNumber,
        },
      });
    }

    this.sendOTP(phoneNumber, code, res);
  }
  async checkOtp(req, res) {
    const { otp: code, phoneNumber } = await checkOtpSchema.validateAsync(
      req.body
    );

    const user = await UserModel.findOne(
      { phoneNumber },
      { password: 0, refreshToken: 0, accessToken: 0 }
    );

    if (!user) throw createError.NotFound("کاربری با این مشخصات یافت نشد");

    // Development bypass must run BEFORE stored-OTP / expiry checks.
    const isDevBypass = isDevelopment() && String(code) === DEV_OTP;

    if (!isDevBypass) {
      if (String(user.otp?.code) !== String(code))
        throw createError.BadRequest("کد ارسال شده صحیح نمیباشد");

      if (new Date(`${user.otp.expiresIn}`).getTime() < Date.now())
        throw createError.BadRequest("کد اعتبار سنجی منقضی شده است");
    }

    user.isVerifiedPhoneNumber = true;
    await user.save();

    await setAccessToken(res, user);
    await setRefreshToken(res, user);
    let WELLCOME_MESSAGE = `کد تایید شد، به کاراوا خوش آمدید`;
    if (!user.isActive)
      WELLCOME_MESSAGE = `کد تایید شد، لطفا اطلاعات خود را تکمیل کنید`;

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: WELLCOME_MESSAGE,
        user,
      },
    });
  }
  async saveUser(phoneNumber, code) {
    const otp = {
      code,
      expiresIn: Date.now() + CODE_EXPIRES,
    };

    const user = await this.checkUserExist(phoneNumber);
    if (user) {
      const updated = await this.updateUser(phoneNumber, { otp });
      // modifiedCount can be 0 if values are identical; user still exists
      return updated || true;
    }

    const created = await UserModel.create({
      phoneNumber,
      otp,
    });
    try {
      const { getOrCreateWallet } = require("../../../utils/walletHelpers");
      await getOrCreateWallet(created._id);
    } catch (err) {
      console.error(
        "Failed to create wallet for new user:",
        err?.message || err
      );
    }
    return created;
  }
  async checkUserExist(phoneNumber) {
    const user = await UserModel.findOne({ phoneNumber });
    return user;
  }
  async updateUser(phoneNumber, objectData = {}) {
    Object.keys(objectData).forEach((key) => {
      const value = objectData[key];
      if (value === undefined || value === null || value === "" || value === " ")
        delete objectData[key];
    });
    const updatedResult = await UserModel.updateOne(
      { phoneNumber },
      { $set: objectData }
    );
    return !!updatedResult.modifiedCount;
  }
  sendOTP(phoneNumber, code, res) {
    const kaveNegarApi = Kavenegar.KavenegarApi({
      apikey: `${process.env.KAVENEGAR_API_KEY}`,
    });
    kaveNegarApi.VerifyLookup(
      {
        receptor: phoneNumber,
        token: code,
        template: "registerVerify",
      },
      (response, status) => {
        console.log(response);
        console.log("kavenegar message status", status);
        if (response && status === 200)
          return res.status(HttpStatus.OK).send({
            statusCode: HttpStatus.OK,
            data: {
              message: `کد تائید برای شماره موبایل ${toPersianDigits(
                phoneNumber
              )} ارسال گردید`,
              expiresIn: CODE_EXPIRES,
              phoneNumber,
            },
          });

        return res.status(status).send({
          statusCode: status,
          message: "کد اعتبارسنجی ارسال نشد",
        });
      }
    );
  }
  async completeProfile(req, res) {
    await completeProfileSchema.validateAsync(req.body);
    const { user } = req;
    const { name, email, role } = req.body;

    if (!user.isVerifiedPhoneNumber)
      throw createError.Forbidden("شماره موبایل خود را تایید کنید.");

    const duplicateUser = await UserModel.findOne({
      email,
      _id: { $ne: user._id },
    });
    if (duplicateUser)
      throw createError.BadRequest(
        "کاربری با این ایمیل قبلا ثبت نام کرده است."
      );

    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: user._id },
      { $set: { name, email, isActive: true, role } },
      { new: true }
    );
    await setAccessToken(res, updatedUser);
    await setRefreshToken(res, updatedUser);

    return res.status(HttpStatus.OK).send({
      statusCode: HttpStatus.OK,
      data: {
        message: "اطلاعات شما با موفقیت تکمیل شد",
        user: updatedUser,
      },
    });
  }
  async updateProfile(req, res) {
    const { _id: userId } = req.user;
    const {
      name,
      email,
      biography,
      phoneNumber,
      skills,
      companyName,
      companyDescription,
    } = await updateProfileSchema.validateAsync(req.body);

    const updatePayload = {
      name,
      email,
      biography,
      phoneNumber,
    };

    if (Array.isArray(skills)) updatePayload.skills = skills;
    if (typeof companyName === "string") updatePayload.companyName = companyName;
    if (typeof companyDescription === "string") {
      updatePayload.companyDescription = companyDescription;
    }

    // Guard the $or: an undefined value would collapse to {} and match every
    // other user, turning a normal save into a bogus "duplicate" error.
    const uniqueChecks = [];
    if (email) uniqueChecks.push({ email });
    if (phoneNumber) uniqueChecks.push({ phoneNumber });

    if (uniqueChecks.length) {
      const conflict = await UserModel.findOne({
        _id: { $ne: userId },
        $or: uniqueChecks,
      }).select({ email: 1, phoneNumber: 1 });
      if (conflict) {
        throw createError.BadRequest(
          conflict.email === email
            ? "کاربر دیگری با این ایمیل ثبت‌نام کرده است"
            : "کاربر دیگری با این شماره موبایل ثبت‌نام کرده است"
        );
      }
    }

    const updateResult = await UserModel.updateOne(
      { _id: userId },
      {
        $set: updatePayload,
      }
    );
    // matchedCount: submitting the same values again is not a failure
    if (updateResult.matchedCount === 0)
      throw createError.BadRequest("اطلاعات ویرایش نشد");
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: "اطلاعات با موفقیت آپدیت شد",
      },
    });
  }
  async refreshToken(req, res) {
    const userId = await verifyRefreshToken(req);
    const user = await UserModel.findById(userId);
    if (!user) throw createError.Unauthorized("حساب کاربری یافت نشد");
    await setAccessToken(res, user);
    await setRefreshToken(res, user);
    return res.status(HttpStatus.OK).json({
      StatusCode: HttpStatus.OK,
      data: {
        user,
      },
    });
  }
  async getUserProfile(req, res) {
    const { _id: userId } = req.user;
    const user = await UserModel.findById(userId, { otp: 0 });
    const {
      getRatingStatsByUserIds,
      withRatingStats,
    } = require("../../../utils/reviewHelpers");
    const statsMap = await getRatingStatsByUserIds([userId]);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        user: withRatingStats(user, statsMap),
      },
    });
  }
  logout(req, res) {
    const cookieOptions = buildAuthCookieOptions({
      maxAge: 1,
      expires: Date.now(),
      secure: process.env.NODE_ENV === "development" ? false : true,
    });
    res.cookie("accessToken", null, cookieOptions);
    res.cookie("refreshToken", null, cookieOptions);

    return res.status(HttpStatus.OK).json({
      StatusCode: HttpStatus.OK,
      roles: null,
      auth: false,
    });
  }
}

module.exports = {
  UserAuthController: new userAuthController(),
};
