import Cast from "../../../model/cast";
import BuzzResource from "../buzz/resources/buzzResource";

class trendServices {

    /**
     * @description: Trendz list
     * @param {*} query 
     * @param {*} auth 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async trendz(query, auth, req, res) {
        try {
            const page = parseInt(query.page) - 1 || 0
            const pageLimit = parseInt(query.limit) || 20

            const aggregationPipeline = [
                {
                    $match: {
                        $and: [
                            { type: { $in: ["1", "2"] } },
                            { isNominateForTrendz: true },
                            { $expr: { $gt: [{ $size: "$likes" }, 1] } }
                        ]
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "user"
                    }
                },
                {
                    $unwind: {
                        path: "$user",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "tagFriend",
                        foreignField: "_id",
                        as: "friend"
                    }
                },
                {
                    $unwind: {
                        path: "$friend",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "castmessages",
                        localField: "thankYouMessage",
                        foreignField: "_id",
                        as: "thankYouMessage"
                    }
                },
                {
                    $unwind: {
                        path: "$thankYouMessage",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "castmessages",
                        localField: "shoutOutMessage",
                        foreignField: "_id",
                        as: "shoutOutMessage"
                    }
                },
                {
                    $unwind: {
                        path: "$shoutOutMessage",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "castmessages",
                        localField: "service",
                        foreignField: "_id",
                        as: "service"
                    }
                },
                {
                    $unwind: {
                        path: "$service",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "castmessages",
                        localField: "feedbackRequest",
                        foreignField: "_id",
                        as: "feedbackRequest"
                    }
                },
                {
                    $unwind: {
                        path: "$feedbackRequest",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "ratings",
                        localField: "_id",
                        foreignField: "castId",
                        as: "ratingDetails"
                    }
                },
                {
                    $lookup: {
                        from: "castviewers",
                        localField: "_id",
                        foreignField: "castId",
                        as: "castviewers"
                    }
                },
                {
                $lookup: {
                  from: "comments",
                  localField: "_id",
                  foreignField: "castId",
                  as: "comments",
                },
              },
              {
                $addFields: {
                  commentsCount: { $size: "$comments" },
                },
              },
              {
                $project: {
                  comments: 0,
                },
              }
            ];

            const trendzList = await Cast.aggregate(aggregationPipeline).sort({ updatedAt: -1 }).skip(page * pageLimit).limit(pageLimit);

            const meta = {
                total: trendzList.length,
                perPage: pageLimit,
                currentPage: page + 1,
                lastPage: Math.ceil(trendzList.length / pageLimit)
            };

            return { data: new BuzzResource(trendzList, auth), meta };

        } catch (error) {
            console.log(error);
        }
    }
}

export default trendServices;