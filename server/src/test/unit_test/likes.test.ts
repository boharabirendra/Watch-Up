import expect from "expect";
import * as Sinon from "sinon";

import * as LikeService from "../../services/likes.service";
import * as LikeModel from "../../models/likes.models";
import { InternalServerError } from "../../errors/error.error";

describe("Like Service Test Suite", () => {
  const likeStatus = {
    id: 1,
    videoPublicId: "video123",
    userId: 1,
    status: "LIKED",
  };

  const videoPublicId = "video123";
  const userId = 1;

  /** GEt like status */
  describe("getLikeStatus", () => {
    let getLikeStatusModelStub: Sinon.SinonStub;

    beforeEach(() => {
      getLikeStatusModelStub = Sinon.stub(LikeModel, "getLikeStatus");
    });

    afterEach(() => {
      Sinon.restore();
    });

    it("Should return like status when it exists", async () => {
      getLikeStatusModelStub.resolves(likeStatus);

      const result = await LikeService.getLikeStatus("video123", 1);

      expect(result).toStrictEqual(likeStatus);
      expect(getLikeStatusModelStub.callCount).toBe(1);
      expect(getLikeStatusModelStub.getCall(0).args).toStrictEqual(["video123", 1]);
    });

    it("Should return null when like status does not exist", async () => {
      getLikeStatusModelStub.resolves(null);

      const result = await LikeService.getLikeStatus("nonexistent", 999);

      expect(result).toBeNull();
      expect(getLikeStatusModelStub.callCount).toBe(1);
      expect(getLikeStatusModelStub.getCall(0).args).toStrictEqual(["nonexistent", 999]);
    });

    it("Should throw InternalServerError when database operation fails", async () => {
      getLikeStatusModelStub.rejects(new Error("Database error"));

      await expect(LikeService.getLikeStatus("video123", 1)).rejects.toThrow(new InternalServerError("Error while fetching video like status"));

      expect(getLikeStatusModelStub.callCount).toBe(1);
      expect(getLikeStatusModelStub.getCall(0).args).toStrictEqual(["video123", 1]);
    });
  });

  /**Update like count */
  describe("updateLikeCount", () => {
    let getLikeStatusStub: Sinon.SinonStub;
    let updateLikeCountStub: Sinon.SinonStub;

    beforeEach(() => {
      getLikeStatusStub = Sinon.stub(LikeModel, "getLikeStatus");
      updateLikeCountStub = Sinon.stub(LikeModel, "updateLikeCount");
    });

    afterEach(() => {
      Sinon.restore();
    });

    it("Should like the video when it was not liked before", async () => {
      getLikeStatusStub.resolves(null);
      updateLikeCountStub.resolves({ likeCount: 1 });

      const result = await LikeService.updateLikeCount(videoPublicId, userId);

      expect(result).toStrictEqual({ likeCount: 1 });
      expect(getLikeStatusStub.callCount).toBe(1);
      expect(getLikeStatusStub.getCall(0).args).toStrictEqual([videoPublicId, userId]);
      expect(updateLikeCountStub.callCount).toBe(1);
      expect(updateLikeCountStub.getCall(0).args).toStrictEqual([videoPublicId, userId, true]);
    });

    it("Should unlike the video when it was liked before", async () => {
      getLikeStatusStub.resolves({ id: 1, videoPublicId, userId, status: "LIKED" });
      updateLikeCountStub.resolves({ likeCount: 0 });

      const result = await LikeService.updateLikeCount(videoPublicId, userId);

      expect(result).toStrictEqual({ likeCount: 0 });
      expect(getLikeStatusStub.callCount).toBe(1);
      expect(getLikeStatusStub.getCall(0).args).toStrictEqual([videoPublicId, userId]);
      expect(updateLikeCountStub.callCount).toBe(1);
      expect(updateLikeCountStub.getCall(0).args).toStrictEqual([videoPublicId, userId, false]);
    });

    it("Should throw InternalServerError when getLikeStatus operation fails", async () => {
      getLikeStatusStub.rejects(new Error("Database error"));

      await expect(LikeService.updateLikeCount(videoPublicId, userId)).rejects.toThrow(new InternalServerError("Error while updating like count"));

      expect(getLikeStatusStub.callCount).toBe(1);
      expect(updateLikeCountStub.callCount).toBe(0);
    });

    it("Should throw InternalServerError when updateLikeCount operation fails", async () => {
      getLikeStatusStub.resolves(null);
      updateLikeCountStub.rejects(new Error("Database error"));

      await expect(LikeService.updateLikeCount(videoPublicId, userId)).rejects.toThrow(new InternalServerError("Error while updating like count"));

      expect(getLikeStatusStub.callCount).toBe(1);
      expect(updateLikeCountStub.callCount).toBe(1);
    });
  });

  /**get like count */
  describe("getLikeCount", () => {
    let getLikeCountModelStub: Sinon.SinonStub;

    beforeEach(() => {
      getLikeCountModelStub = Sinon.stub(LikeModel, "getLikeCount");
    });

    afterEach(() => {
      Sinon.restore();
    });

    it("Should return like count when video exists", async () => {
      const expectedLikeCount = { likeCount: 10 };
      getLikeCountModelStub.resolves(expectedLikeCount);

      const result = await LikeService.getLikeCount(videoPublicId);

      expect(result).toStrictEqual(expectedLikeCount);
      expect(getLikeCountModelStub.callCount).toBe(1);
      expect(getLikeCountModelStub.getCall(0).args[0]).toBe(videoPublicId);
    });

    it("Should return zero likes when video has no likes", async () => {
      const expectedLikeCount = { likeCount: 0 };
      getLikeCountModelStub.resolves(expectedLikeCount);

      const result = await LikeService.getLikeCount(videoPublicId);

      expect(result).toStrictEqual(expectedLikeCount);
      expect(getLikeCountModelStub.callCount).toBe(1);
      expect(getLikeCountModelStub.getCall(0).args[0]).toBe(videoPublicId);
    });

    it("Should throw InternalServerError when database operation fails", async () => {
      getLikeCountModelStub.rejects(new Error("Database error"));

      await expect(LikeService.getLikeCount(videoPublicId)).rejects.toThrow(new InternalServerError("Error while fetching likes count"));

      expect(getLikeCountModelStub.callCount).toBe(1);
      expect(getLikeCountModelStub.getCall(0).args[0]).toBe(videoPublicId);
    });
  });
});
