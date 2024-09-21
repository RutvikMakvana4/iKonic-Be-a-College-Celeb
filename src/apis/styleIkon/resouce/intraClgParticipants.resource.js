import { baseUrl } from "../../../common/constants/configConstants";

class intraClgParticipantsResource {
  constructor(participants) {
    const type = participants.type;
    // const authUser = participants.authUser;
    // if (+participants.type == 1) {
    //   return participants.map((participant) => ({
    //     participantId: participant._id,
    //     images: participant.images.map((img) => ({
    //       img: baseUrl(img.replace("public/", "")),
    //     })),
    //     likes: participant.likesCount,
    //     college: participant.participantInfo.collegeName
    //       ? participant.participantInfo.collegeName
    //       : null,
    //     firstName: participant.participantInfo.firstName,
    //     lastName: participant.participantInfo.lastName,
    //     profileImage: null,
    //     islike: true,
    //   }));
    // } else if (+participants.type == 2) {
    //   return participants.map((participant) => ({
    //     participantId: participant.participantId,
    //     collegeId: participant.collegeId,
    //     likes: participant.likesCount,
    //     images: participant.images.map((img) => ({
    //       img: baseUrl(img.replace("public/", "")),
    //     })),
    //     firstName: participant.firstName,
    //     lastName: participant.lastName,
    //     userId: participant.userId,
    //     college: participant.collegeName ? participant.collegeName : null,
    //     profileImage: participant.profilePicture,
    //     islike: true,
    //   }));
    // }

    // console.log(participants.type);
    return participants.map((participant) => ({
      participantId: +type == 1 ? participant._id : participant.participantId,
      images: participant.images.map((img) => ({
        img: baseUrl(img.replace("public/", "")),
      })),
      likes: participant.likesCount,
      firstName:
        +type == 1
          ? participant.participantInfo.firstName
          : participant.firstName,
      lastName:
        +type == 1
          ? participant.participantInfo.lastName
          : participant.lastName,
      college:
        +type == 1
          ? participant.participantInfo.collegeName
          : participant.collegeName,
      userId: +type == 2 ? participant.userId : null,
      collegeId: +type == 2 ? participant.collegeId : null,
      profileImage:  +type == 1 && participant.participantInfo.profilePicture != null
      ? baseUrl(participant.participantInfo.profilePicture)
      : participant.profilePicture ? baseUrl(participant.profilePicture) : null,
      islike:  participant.islike && participant.islike != null ? true : false ,
    }));
  }
}

export default intraClgParticipantsResource;
