import TuneIn from "../../../model/tuneIn";
import User from "../../../model/user";
import TuneInViewer from "../../../model/tuneInViewer";
import {
  BadRequestException,
  NotFoundException,
} from "../../../src/common/exceptions/errorException";
import MyTuneInResource from "./resources/myTuneInResource";
import TuneInResource from "./resources/tuneInResource";
import ViewerTuneInResource from "./resources/viewerTuneInResource";
import FriendTuneInResource from "./resources/friendTuneInResource";
import mongoose from "mongoose";
import MapUserListResource from "./resources/mapUserListResource";
const ObjectId = mongoose.Types.ObjectId;

class tuneInServices {
  /**
   * @description: Tune In
   * @param {*} id
   * @param {*} auth
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async tuneIn(data, auth, req, res) {
    await TuneIn.create({
      userId: auth,
      ...data,
    });
  }

  /**
   * @description : My Tune In
   * @param {*} auth
   * @param {*} req
   * @param {*} res
   */
  static async myTuneIn(auth, req, res) {
    const myTuneIn = await TuneIn.findOne({ userId: auth })
      .populate("userId")
      .populate("mood");

    if (myTuneIn) {
      return { ...new MyTuneInResource(myTuneIn) };
    } else {
      throw new NotFoundException("Your Tune in not found");
    }
  }

  /**
   * @description : My Tune In views
   * @param {*} auth
   * @param {*} req
   * @param {*} res
   */
  static async myTuneInViews(query, auth, req, res) {
    const tuneInId = query.tuneInId;
    const page = parseInt(query.page) - 1 || 0;
    const pageLimit = parseInt(query.limit) || 20;

    let findViewers = await TuneInViewer.find({ tuneInId: tuneInId })
      .populate("tuneInId")
      .populate("view");

    findViewers.sort((a, b) => {
      if (a.isUnlockProfile && !b.isUnlockProfile) return -1;
      if (b.isUnlockProfile && !a.isUnlockProfile) return 1;
      return 0;
    });

    const meta = {
      total: findViewers.length,
      perPage: pageLimit,
      currentPage: page + 1,
      lastPage: Math.ceil(findViewers.length / pageLimit),
    };

    return { data: new ViewerTuneInResource(findViewers), meta };
  }

  /**
   * @description : Unlock this profile
   * @param {*} id
   * @param {*} req
   * @param {*} res
   */
  static async unlockProfile(id, req, res) {
    await TuneInViewer.findByIdAndUpdate(
      id,
      {
        isUnlockProfile: true,
      },
      { new: true }
    );
  }

  /**
   * @description: Tune In Listing
   * @param {*} auth
   * @param {*} req
   * @param {*} res
   */
  static async tuneInList(query, auth, req, res) {
    try {
      const page = parseInt(query.page) - 1 || 0;
      const pageLimit = parseInt(query.limit) || 20;

      const myTuneIn = await TuneIn.findOne({ userId: auth })
        .populate("userId")
        .populate("mood");

      const findAuthUser = await User.findById(auth);
      const authUserLatitude = findAuthUser.latitude;
      const authUserLongitude = findAuthUser.longitude;

      // calculate distance around 15 miles area
      const getOtherUsers = await User.aggregate([
        {
          $addFields: {
            distance: {
              // count the distance from latitude and longitude
              $round: [
                {
                  $multiply: [
                    {
                      $acos: {
                        $add: [
                          {
                            $multiply: [
                              {
                                $sin: {
                                  $degreesToRadians: authUserLatitude,
                                },
                              },
                              {
                                $sin: {
                                  $degreesToRadians: "$latitude",
                                },
                              },
                            ],
                          },
                          {
                            $multiply: [
                              {
                                $cos: {
                                  $degreesToRadians: authUserLatitude,
                                },
                              },
                              {
                                $cos: {
                                  $degreesToRadians: "$latitude",
                                },
                              },
                              {
                                $cos: {
                                  $subtract: [
                                    {
                                      $degreesToRadians: authUserLongitude,
                                    },
                                    {
                                      $degreesToRadians: "$longitude",
                                    },
                                  ],
                                },
                              },
                            ],
                          },
                        ],
                      },
                    },
                    6371, // Earth's radius in kilometers
                  ],
                },
                2,
              ],
            },
          },
        },
        {
          $match: {
            _id: { $ne: new ObjectId(auth) },
            distance: { $lte: 24.1402 },
          },
        },
      ]);

      const otherUserIds = getOtherUsers.map((user) => user._id);

      const othersTuneIn = await TuneIn.find({
        userId: { $in: otherUserIds, $ne: auth },
      })
        .skip(page * pageLimit)
        .limit(pageLimit)
        .populate("userId")
        .populate("mood");

      const tuneInIds = othersTuneIn.map((tuneIn) => tuneIn._id);

      const checkAlreadyView = await TuneInViewer.find({
        tuneInId: { $in: tuneInIds },
        view: auth,
      });

      const tuneInResource = new TuneInResource(
        othersTuneIn,
        auth,
        checkAlreadyView
      );

      const meta = {
        total: othersTuneIn.length,
        perPage: pageLimit,
        currentPage: page + 1,
        lastPage: Math.ceil(othersTuneIn.length / pageLimit),
      };

      return {
        data: {
          myTuneIn: myTuneIn !== null ? new MyTuneInResource(myTuneIn) : null,
          tuneInList: tuneInResource.getData(),
        },
        meta,
      };
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * @description: View friend tune in
   * @param {*} id
   * @param {*} auth
   * @param {*} req
   * @param {*} res
   */
  static async viewFriendTuneIn(id, auth, req, res) {
    const findFriendTuneIn = await TuneIn.findById(id)
      .populate("userId")
      .populate("mood");

    if (findFriendTuneIn) {
      await TuneIn.findByIdAndUpdate(
        findFriendTuneIn._id,
        { $push: { viewBy: auth } },
        { new: true }
      );

      const checkAlreadyView = await TuneInViewer.findOne({
        tuneInId: id,
        view: auth,
      });

      let iAmIn = false;
      if (checkAlreadyView !== null) {
        iAmIn = true;
      }

      return { ...new FriendTuneInResource(findFriendTuneIn, iAmIn) };
    } else {
      throw new NotFoundException("Your friend Tune in not found");
    }
  }

  /**
   * @description : View Tune in
   * @param {*} req
   * @param {*} res
   */
  static async viewTuneIn(id, auth, req, res) {
    const findTuneIn = await TuneIn.findOne({ _id: id });

    if (findTuneIn) {
      const findViewer = await TuneInViewer.findOne({
        tuneInId: id,
        view: auth,
      });

      if (!findViewer) {
        await TuneInViewer.create({
          tuneInId: id,
          view: auth,
        });
      }
    } else {
      throw new NotFoundException("This Tune In not found");
    }
  }

  /**
   * @description: Delete tune in
   * @param {*} id
   * @param {*} auth
   * @param {*} req
   * @param {*} res
   */
  static async deleteTuneIn(id, auth, req, res) {
    const myTuneIn = await TuneIn.findOne({ _id: id, userId: auth });

    if (!myTuneIn) {
      throw new NotFoundException("Tune In not found");
    }

    await TuneIn.findByIdAndDelete(myTuneIn._id);
    await TuneInViewer.deleteMany({ tuneInId: id });
  }

  /**
   * @description: Calculate total students count around 15 miles
   * @param {*} data
   * @param {*} auth
   * @param {*} req
   * @param {*} res
   */
  static async totalStudents(auth, req, res) {

    const findAuthUser = await User.findById(auth);
    const authUserLatitude = findAuthUser.latitude;
    const authUserLongitude = findAuthUser.longitude;

    const getUsers = await User.aggregate([
      {
        $addFields: {
          distance: {
            // count the distance from latitude and longitude
            $round: [
              {
                $multiply: [
                  {
                    $acos: {
                      $add: [
                        {
                          $multiply: [
                            {
                              $sin: {
                                $degreesToRadians: authUserLatitude,
                              },
                            },
                            {
                              $sin: {
                                $degreesToRadians: "$latitude",
                              },
                            },
                          ],
                        },
                        {
                          $multiply: [
                            {
                              $cos: {
                                $degreesToRadians: authUserLatitude,
                              },
                            },
                            {
                              $cos: {
                                $degreesToRadians: "$latitude",
                              },
                            },
                            {
                              $cos: {
                                $subtract: [
                                  {
                                    $degreesToRadians: authUserLongitude,
                                  },
                                  {
                                    $degreesToRadians: "$longitude",
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      ],
                    },
                  },
                  6371, // Earth's radius in kilometers
                ],
              },
              2,
            ],
          },
        },
      },
      {
        $match: {
          _id: { $ne: new ObjectId(auth) },
          distance: { $lte: 24.1402 },
        },
      },
    ]);
 
    return { ...new MapUserListResource(getUsers) };
  }
}

export default tuneInServices;
