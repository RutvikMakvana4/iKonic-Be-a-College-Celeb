import express from "express";
const router = express.Router();
import asyncHandler from "express-async-wrapper";
import StyleIkonController from "./styleIkonController";
import storeFiles from "../../common/middleware/multerImageStore";

const fields = [
  { name: "images", destination: "public/participants", maxCount: 3 },
];

router.post(
  "/participate",
  storeFiles(fields),
  asyncHandler(StyleIkonController.participate)
);
router.post(
  "/participate/like-dislike",
  asyncHandler(StyleIkonController.likeDislike)
);

router.get(
  "/participants",
  asyncHandler(StyleIkonController.intraClgParticipants)
);

router.get(
  "/leading-universities",
  asyncHandler(StyleIkonController.leadingUniversities)
);

router.get(
  "/national-round-participants",
  asyncHandler(StyleIkonController.nationalParticipants)
);

module.exports = router;
