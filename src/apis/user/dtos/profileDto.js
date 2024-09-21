import Joi from "joi";

export const ProfileDto = Joi.object().keys({
  status: Joi.string().required(),
  dateOfBirth: Joi.alternatives().conditional("status", {
    is: "1",
    then: Joi.string().required(),
    otherwise: Joi.string().optional(),
  }),
  pronouns: Joi.alternatives().conditional("status", {
    is: "2",
    then: Joi.string().optional(),
    otherwise: Joi.string().optional(),
  }),
  collegeId: Joi.alternatives().conditional("status", {
    is: "3",
    then: Joi.number().required(),
    otherwise: Joi.number().forbidden(),
  }),
  collegeName: Joi.alternatives().conditional("status", {
    is: "3",
    then: Joi.string().required(),
    otherwise: Joi.string().forbidden(),
  }),
  isAgree: Joi.alternatives().conditional("status", {
    is: "4",
    then: Joi.boolean().required(),
    otherwise: Joi.boolean().optional(),
  }),
  bio: Joi.alternatives().conditional("status", {
    is: "5",
    then: Joi.string().optional(),
    otherwise: Joi.string().optional(),
  }),
  profilePicture: Joi.alternatives().conditional("status", {
    is: "6",
    then: Joi.string(),
    otherwise: Joi.string(),
  }),
  interests: Joi.alternatives().conditional("status", {
    is: "7",
    then: Joi.any(),
    otherwise: Joi.any(),
  }),
  subCultures: Joi.alternatives().conditional("status", {
    is: "8",
    then: Joi.any(),
    otherwise: Joi.any(),
  }),
  isAccountActive: Joi.alternatives().conditional("status", {
    is: "9",
    then: Joi.boolean().required(),
    otherwise: Joi.boolean().optional(),
  }),
  docUpload: Joi.alternatives().conditional("status", {
    is: "10",
    then: Joi.string(),
    otherwise: Joi.string(),
  }),
  latitude: Joi.alternatives().conditional("status", {
    is: "11",
    then: Joi.number(),
    otherwise: Joi.number(),
  }),
  longitude: Joi.alternatives().conditional("status", {
    is: "11",
    then: Joi.number(),
    otherwise: Joi.number(),
  }),
});
