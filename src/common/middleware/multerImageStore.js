import multer from "multer";
import fs from "fs";
import { randomNumberGenerator } from "../helper";

// const fields = [
//   { name: "uploadFile", destination: "public/cast" },
//   { name: "thumbnail", destination: "public/thumbnail" },
//   { name: "uploadFiles", destination:"public/photoCast"}
// ];
// routes.post('/create-cast', authentication, storeFiles(fields), validator.body(CastDto), asyncWrap(castController.createCast));

const storeFiles = (fields) => async (req, res, next) => {
  return new Promise((resolve, reject) => {
    const multerStorage = multer.diskStorage({
      destination: (req, file, cb) => {
        const fieldDestination = fields.find(
          (field) => field.name === file.fieldname
        )?.destination;

        fs.mkdirSync(fieldDestination, { recursive: true });
        cb(null, fieldDestination);
      },
      filename: (req, file, cb) => {
        const name = randomNumberGenerator(14);
        const ext = file.mimetype.split("/")[1];
        if (file.fieldname == "contents") {
          cb(null, `${file.originalname}`);
        } else {
          cb(null, `${file.fieldname}-${name}.${ext}`);
        }
      },
    });

    const upload = multer({ storage: multerStorage }).fields(fields);
    upload(req, res, (err) => {
      if (err) {
        if (err.code === "LIMIT_UNEXPECTED_FILE") {
          const field = err.field;
          const fieldInfo = fields.find((f) => f.name === field);
          const maxCount = fieldInfo ? fieldInfo.maxCount : "unknown";
          err.message = `Maximum file count exceeded for field '${field}'. Maximum allowed: ${maxCount}`;
        }
        return reject(err);
      }

      resolve();
    });
  })
    .then(() => next())
    .catch((err) => {
      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        res.status(400).send({ error: err.message });
      } else {
        res.send({ error: err });
      }
    });
};

export default storeFiles;

// const fields = [
//     { name: "image", destination: "mediaData/profileImages", maxCount: 3 },
// ];

// router.post("/profile-image", storeFiles(fields), asyncHandler(userController.updateUserImage));
