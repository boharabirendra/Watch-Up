import Sinon from "sinon";
import { expect } from "expect";

import * as UploadImageOnCloudinary from "../../utils/cloudinary.utils";
import * as GenerateAccessAndRefreshToken from "../../utils/generateTokens.utils";
import * as GenerateHashedPassword from "../../utils/generateHashedPassword.utils";

import * as UserModel from "../../models/users.models";
import { IUser } from "../../interface/user.interface";
import * as UserService from "../../services/users.service";
import { BadRequestError, ConflictError, InternalServerError, NotFoundError, UnauthenticatedError } from "../../errors/error.error";

describe("User Service Test Suite", () => {
  const user: IUser = {
    role: "VIEWER",
    imagePublicId: "image123",
    fullName: "BIrendra Bohara",
    password: "Kanchanpur1230@",
    email: "ramduplicate@gmail.com",
    profileUrl: "https://cloudinary.com/image.jpg",
  };

  const loginCredentials = {
    email: "test@example.com",
    password: "password123",
  };

  const changePasswordData = {
    id: 1,
    oldPassword: "oldPassword123",
    newPassword: "newPassword123",
  };
  /**Register user */
  describe("registerUser", () => {
    let userModelIsUserExistsStub: Sinon.SinonStub;
    let userModelRegisterUserStub: Sinon.SinonStub;
    let cloudinaryUploadImageStub: Sinon.SinonStub;
    let passwordGenerateHashedPasswordStub: Sinon.SinonStub;

    beforeEach(() => {
      userModelIsUserExistsStub = Sinon.stub(UserService, "isUserExists");
      userModelRegisterUserStub = Sinon.stub(UserModel, "registerUser");
      cloudinaryUploadImageStub = Sinon.stub(UploadImageOnCloudinary, "uploadImageOnCloudinary");
      passwordGenerateHashedPasswordStub = Sinon.stub(GenerateHashedPassword, "generateHashedPassword");
    });

    afterEach(() => {
      Sinon.restore();
    });

    it("Should create user", async () => {
      passwordGenerateHashedPasswordStub.resolves("hashedPassword");
      userModelIsUserExistsStub.resolves(null);
      userModelRegisterUserStub.resolves(user);
      cloudinaryUploadImageStub.resolves({
        secure_url: "https://cloudinary.com/image.jpg",
        public_id: "image123",
      });
      await UserService.registerUser(user);
      expect(passwordGenerateHashedPasswordStub.callCount).toBe(1);
      expect(passwordGenerateHashedPasswordStub.getCall(0).args).toStrictEqual([user.password]);
      expect(userModelRegisterUserStub.callCount).toBe(1);
      expect(userModelRegisterUserStub.getCall(0).args).toStrictEqual([
        {
          ...user,
          password: "hashedPassword",
        },
      ]);
    });

    it("Should throw conflict error if user already exist", async () => {
      userModelIsUserExistsStub.returns(user);
      expect(async () => await UserService.registerUser(user)).rejects.toThrow(new ConflictError(`User already exists.`));
      expect(userModelIsUserExistsStub.callCount).toBe(1);
      expect(userModelIsUserExistsStub.getCall(0).args).toStrictEqual([{ email: user.email }]);
    });
  });

  /**Login user */
  describe("loginUser", () => {
    let isUserExistsStub: Sinon.SinonStub;
    let isPasswordValidStub: Sinon.SinonStub;
    let generateAccessAndRefreshTokenStub: Sinon.SinonStub;
    let getUserByEmailStub: Sinon.SinonStub;

    beforeEach(() => {
      isUserExistsStub = Sinon.stub(UserService, "isUserExists");
      getUserByEmailStub = Sinon.stub(UserModel, "getUserByEmail");
      isPasswordValidStub = Sinon.stub(UserService, "isPasswordValid");
      generateAccessAndRefreshTokenStub = Sinon.stub(GenerateAccessAndRefreshToken, "generateAccessAndRefreshToken");
    });

    afterEach(() => {
      Sinon.restore();
    });

    it("Should login user successfully", async () => {
      isUserExistsStub.resolves(user);
      isPasswordValidStub.resolves(true);
      generateAccessAndRefreshTokenStub.returns({
        accessToken: "accessToken123",
        refreshToken: "refreshToken123",
      });
      getUserByEmailStub.resolves(user);

      const result = await UserService.loginUser(loginCredentials);

      expect(isUserExistsStub.callCount).toBe(1);
      expect(isUserExistsStub.getCall(0).args[0]).toStrictEqual({ email: loginCredentials.email });

      expect(isPasswordValidStub.callCount).toBe(1);
      expect(isPasswordValidStub.getCall(0).args).toStrictEqual([loginCredentials.password, user.password]);

      expect(generateAccessAndRefreshTokenStub.callCount).toBe(1);
      expect(generateAccessAndRefreshTokenStub.getCall(0).args[0]).toStrictEqual({
        id: user.id,
        role: user.role,
        email: user.email,
        fullName: user.fullName,
        profileUrl: user.profileUrl,
      });

      expect(getUserByEmailStub.callCount).toBe(1);
      expect(getUserByEmailStub.getCall(0).args[0]).toBe(loginCredentials.email);

      expect(result).toStrictEqual({
        accessToken: "accessToken123",
        refreshToken: "refreshToken123",
        ...user,
        password: "",
      });
    });

    it("Should throw ApiResponse if user does not exist", async () => {
      isUserExistsStub.resolves(null);
      await expect(UserService.loginUser(loginCredentials)).rejects.toThrow(new NotFoundError("Invalid password or email"));
      expect(isUserExistsStub.callCount).toBe(1);
      expect(isPasswordValidStub.callCount).toBe(0);
      expect(generateAccessAndRefreshTokenStub.callCount).toBe(0);
      expect(getUserByEmailStub.callCount).toBe(0);
    });

    it("Should throw UnauthenticatedError if password is invalid", async () => {
      isUserExistsStub.resolves(user);
      isPasswordValidStub.resolves(false);

      await expect(UserService.loginUser(loginCredentials)).rejects.toThrow(new UnauthenticatedError("Invalid password or email"));

      expect(isUserExistsStub.callCount).toBe(1);
      expect(isPasswordValidStub.callCount).toBe(1);
      expect(generateAccessAndRefreshTokenStub.callCount).toBe(0);
      expect(getUserByEmailStub.callCount).toBe(0);
    });

    it("Should throw InternalServerError if login fails", async () => {
      isUserExistsStub.resolves(user);
      isPasswordValidStub.resolves(true);
      generateAccessAndRefreshTokenStub.throws(new Error("Token generation failed"));

      await expect(UserService.loginUser(loginCredentials)).rejects.toThrow(new InternalServerError("Login failed."));
      expect(isUserExistsStub.callCount).toBe(1);
      expect(isPasswordValidStub.callCount).toBe(1);
      expect(generateAccessAndRefreshTokenStub.callCount).toBe(1);
      expect(getUserByEmailStub.callCount).toBe(0);
    });
  });

  /**Change password */
  describe("changePassword", () => {
    let isUserExistsStub: Sinon.SinonStub;
    let isPasswordValidStub: Sinon.SinonStub;
    let generateHashedPasswordStub: Sinon.SinonStub;
    let changePasswordModelStub: Sinon.SinonStub;

    beforeEach(() => {
      isUserExistsStub = Sinon.stub(UserService, "isUserExists");
      isPasswordValidStub = Sinon.stub(UserService, "isPasswordValid");
      changePasswordModelStub = Sinon.stub(UserModel, "changePassword");
      generateHashedPasswordStub = Sinon.stub(GenerateHashedPassword, "generateHashedPassword");
    });

    afterEach(() => {
      Sinon.restore();
    });

    it("Should change password successfully", async () => {
      isUserExistsStub.resolves(user);
      isPasswordValidStub.resolves(true);
      generateHashedPasswordStub.resolves("newHashedPassword123");
      changePasswordModelStub.resolves();

      await UserService.changePassword(changePasswordData);

      expect(isUserExistsStub.callCount).toBe(1);
      expect(isUserExistsStub.getCall(0).args[0]).toStrictEqual({ id: changePasswordData.id });

      expect(isPasswordValidStub.callCount).toBe(1);
      expect(isPasswordValidStub.getCall(0).args).toStrictEqual([changePasswordData.oldPassword, user.password]);

      expect(generateHashedPasswordStub.callCount).toBe(1);
      expect(generateHashedPasswordStub.getCall(0).args[0]).toBe(changePasswordData.newPassword);

      expect(changePasswordModelStub.callCount).toBe(1);
      expect(changePasswordModelStub.getCall(0).args[0]).toStrictEqual({
        id: changePasswordData.id,
        newPassword: "newHashedPassword123",
      });
    });

    it("Should throw ApiResponse if user does not exist", async () => {
      isUserExistsStub.resolves(null);

      await expect(UserService.changePassword(changePasswordData)).rejects.toThrow(new NotFoundError("User does not exist."));

      expect(isUserExistsStub.callCount).toBe(1);
      expect(isPasswordValidStub.callCount).toBe(0);
      expect(generateHashedPasswordStub.callCount).toBe(0);
      expect(changePasswordModelStub.callCount).toBe(0);
    });

    it("Should throw BadRequestError if old password is invalid", async () => {
      isUserExistsStub.resolves(user);
      isPasswordValidStub.resolves(false);

      await expect(UserService.changePassword(changePasswordData)).rejects.toThrow(new BadRequestError("Invalid old password"));

      expect(isUserExistsStub.callCount).toBe(1);
      expect(isPasswordValidStub.callCount).toBe(1);
      expect(generateHashedPasswordStub.callCount).toBe(0);
      expect(changePasswordModelStub.callCount).toBe(0);
    });

    it("Should throw InternalServerError if password change fails", async () => {
      isUserExistsStub.resolves(user);
      isPasswordValidStub.resolves(true);
      generateHashedPasswordStub.resolves("newHashedPassword123");
      changePasswordModelStub.rejects(new Error("Database error"));

      await expect(UserService.changePassword(changePasswordData)).rejects.toThrow(new InternalServerError("Password change failed."));

      expect(isUserExistsStub.callCount).toBe(1);
      expect(isPasswordValidStub.callCount).toBe(1);
      expect(generateHashedPasswordStub.callCount).toBe(1);
      expect(changePasswordModelStub.callCount).toBe(1);
    });
  });

  /**Get user id */
  describe("getUserById", () => {
    let getUserByIdModelStub: Sinon.SinonStub;

    beforeEach(() => {
      getUserByIdModelStub = Sinon.stub(UserModel, "getUserById");
    });

    afterEach(() => {
      Sinon.restore();
    });

    it("Should return user when user exists", async () => {
      getUserByIdModelStub.resolves(user);

      const result = await UserService.getUserById(1);

      expect(result).toStrictEqual(user);
      expect(getUserByIdModelStub.callCount).toBe(1);
      expect(getUserByIdModelStub.getCall(0).args[0]).toBe(1);
    });

    it("Should return null when user does not exist", async () => {
      getUserByIdModelStub.resolves(null);

      const result = await UserService.getUserById(999);

      expect(result).toBeNull();
      expect(getUserByIdModelStub.callCount).toBe(1);
      expect(getUserByIdModelStub.getCall(0).args[0]).toBe(999);
    });

    it("Should throw InternalServerError when database operation fails", async () => {
      getUserByIdModelStub.rejects(new Error("Database error"));

      await expect(UserService.getUserById(1)).rejects.toThrow(new InternalServerError("Error while fetching user"));

      expect(getUserByIdModelStub.callCount).toBe(1);
      expect(getUserByIdModelStub.getCall(0).args[0]).toBe(1);
    });
  });

  /**Get user by email */
  describe("getUserByEmail", () => {
    let getUserByEmailModelStub: Sinon.SinonStub;

    beforeEach(() => {
      getUserByEmailModelStub = Sinon.stub(UserModel, "getUserByEmail");
    });

    afterEach(() => {
      Sinon.restore();
    });

    it("Should return user when user exists", async () => {
      getUserByEmailModelStub.resolves(user);

      const result = await UserService.getUserByEmail("john@example.com");

      expect(result).toStrictEqual(user);
      expect(getUserByEmailModelStub.callCount).toBe(1);
      expect(getUserByEmailModelStub.getCall(0).args[0]).toBe("john@example.com");
    });

    it("Should return null when user does not exist", async () => {
      getUserByEmailModelStub.resolves(null);

      const result = await UserService.getUserByEmail("nonexistent@example.com");

      expect(result).toBeNull();
      expect(getUserByEmailModelStub.callCount).toBe(1);
      expect(getUserByEmailModelStub.getCall(0).args[0]).toBe("nonexistent@example.com");
    });

    it("Should throw InternalServerError when database operation fails", async () => {
      getUserByEmailModelStub.rejects(new Error("Database error"));

      await expect(UserService.getUserByEmail("john@example.com")).rejects.toThrow(new InternalServerError("Error while fetching user"));

      expect(getUserByEmailModelStub.callCount).toBe(1);
      expect(getUserByEmailModelStub.getCall(0).args[0]).toBe("john@example.com");
    });
  });
});
