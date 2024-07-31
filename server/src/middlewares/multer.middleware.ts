import multer from "multer";

/**
 *  // Store the file in memory
    const storage = multer.memoryStorage(); 
    const upload = multer({ storage: storage });
 * 
 */

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const upload = multer({ storage });

export const registerUserBodyParser = upload.fields([
  { name: "profile", maxCount: 1 },
  { name: "email", maxCount: 1 },
  { name: "fullName", maxCount: 1 },
  { name: "password", maxCount: 1 },
  { name: "role", maxCount: 1 },
]);

export const loginUserBodyParser = upload.fields([
  { name: "email", maxCount: 1 },
  { name: "password", maxCount: 1 },
]);

export const updateUserBodyParser = upload.fields([
  { name: "email", maxCount: 1 },
  { name: "fullName", maxCount: 1 },
  { name: "profile", maxCount: 1 },
]);

export const changePasswordBodyParser = upload.fields([
  { name: "id", maxCount: 1 },
  { name: "oldPassword", maxCount: 1 },
  { name: "newPassword", maxCount: 1 },
]);

export const uploadVideoBodyParser = upload.fields([
  { name: "video", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 },
  { name: "title", maxCount: 1 },
  { name: "description", maxCount: 1 },
]);

export const commentBodyParser = upload.fields([
  { name: "text", maxCount: 1 },
  { name: "videoId", maxCount: 1 },
]);
