import Joi from "joi";

export const CastDto = Joi.object().keys({
    type: Joi.string().required(),
    docType: Joi.string(),
    thumbnail: Joi.alternatives().conditional("type",
        {
            is: "2",
            then: Joi.string(),
            otherwise: Joi.string()
        },
        {
            is: "6",
            then: Joi.string().optional(),
            otherwise: Joi.string().optional()
        }

    ),
    uploadFile: Joi.alternatives().conditional("type",
        {
            is: "1",
            then: Joi.string(),
            otherwise: Joi.string()
        },
        {
            is: "2",
            then: Joi.string(),
            otherwise: Joi.string(),
        },
        {
            is: "6",
            then: Joi.string(),
            otherwise: Joi.string(),
        },
    ),
    uploadFileName: Joi.string().optional(),
    uploadFiles: Joi.array().optional(),
    location: Joi.alternatives().conditional("type",
        {
            is: "1",
            then: Joi.string().optional(),
            otherwise: Joi.string().optional()
        },
        {
            is: "2",
            then: Joi.string().optional(),
            otherwise: Joi.string().optional()
        }
    ),
    latitude: Joi.alternatives().conditional("type",
        {
            is: "1",
            then: Joi.string().optional(),
            otherwise: Joi.string().optional()
        },
        {
            is: "2",
            then: Joi.string().optional(),
            otherwise: Joi.string().optional()
        }
    ),
    longitude: Joi.alternatives().conditional("type",
        {
            is: "1",
            then: Joi.string().optional(),
            otherwise: Joi.string().optional()
        },
        {
            is: "2",
            then: Joi.string().optional(),
            otherwise: Joi.string().optional()
        }
    ),
    tagFriend: Joi.alternatives().conditional("type",
        {
            is: "1",
            then: Joi.any(),
            otherwise: Joi.any()
        },
        {
            is: "2",
            then: Joi.any(),
            otherwise: Joi.any()
        },
        {
            is: "3",
            then: Joi.any(),
            otherwise: Joi.any()
        },
        {
            is: "4",
            then: Joi.any(),
            otherwise: Joi.any()
        }

    ),
    describeCast: Joi.alternatives().conditional("type",
        {
            is: "3",
            then: Joi.string().optional(),
            otherwise: Joi.string().optional(),
        },
        {
            is: "6",
            then: Joi.string().optional(),
            otherwise: Joi.string().optional(),
        },
        {
            is: "5",
            then: Joi.string().optional(),
            otherwise: Joi.string().optional(),
        }
    ),
    isNominateForTrendz: Joi.alternatives().conditional("type",
        {
            is: "1",
            then: Joi.boolean().optional(),
            otherwise: Joi.boolean().optional(),
        },
        {
            is: "2",
            then: Joi.boolean().optional(),
            otherwise: Joi.boolean().optional(),
        }
    ),
    thankYouMessage: Joi.alternatives().conditional("type",
        {
            is: "3",
            then: Joi.string().required(),
            otherwise: Joi.string().optional()
        }
    ),
    shoutOutMessage: Joi.alternatives().conditional("type",
        {
            is: "4",
            then: Joi.string().required(),
            otherwise: Joi.string().optional()
        }
    ),
    service: Joi.alternatives().conditional("type", {
        is: "5",
        then: Joi.string().required(),
        otherwise: Joi.string().optional()
    }),
    frequency: Joi.alternatives().conditional("type", {
        is: "5",
        then: Joi.string().required(),
        otherwise: Joi.string().optional()
    }),
    amount: Joi.alternatives().conditional("type", {
        is: "5",
        then: Joi.number().required(),
        otherwise: Joi.number().optional()
    }),
    feedbackRequest: Joi.alternatives().conditional("type", {
        is: "6",
        then: Joi.string().required(),
        otherwise: Joi.string().optional()
    }),
});