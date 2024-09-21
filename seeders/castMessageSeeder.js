import CastMessages from "../model/castMessages";
import { baseUrl } from "../src/common/constants/configConstants";

const data = [
    {
        type: 3,
        message: "You Made My Day"
    },
    {
        type: 3,
        message: "Appreciate all the Help"
    },
    {
        type: 3,
        message: "Appreciate the Guidance"
    },
    {
        type: 3,
        message: "Appreciate the Thoughtful Gesture"
    },
    {
        type: 3,
        message: "Appreciate the Collaboration"
    },
    {
        type: 3,
        message: "Appreciate the Warm Welcome"
    },
    {
        type: 3,
        message: "For Everything"
    },
    {
        type: 3,
        message: "Your Act of Kindness Did Not Go Unnoticed"
    },
    {
        type: 3,
        message: "Appreciate You More Than Words Can Express"
    },
    {
        type: 3,
        message: "Grateful to Have You In My Life"
    },
    {
        type: 3,
        message: "For Your Social Commitment. You make a difference"
    },
    {
        type: 4,
        message: "An Innovation Leader"
    },
    {
        type: 4,
        message: "A Music Sensation"
    },
    {
        type: 4,
        message: "An Inspiration to Sports Lover"
    },
    {
        type: 4,
        message: "A Fashion Icon"
    },
    {
        type: 4,
        message: "A Sports Champion"
    },
    {
        type: 4,
        message: "A True Genius"
    },
    {
        type: 4,
        message: "A Leader"
    },
    {
        type: 4,
        message: "A Great Writer"
    },
    {
        type: 4,
        message: "A Rock Star"
    },
    {
        type: 4,
        message: "An Amazing Performer"
    },
    {
        type: 4,
        message: "Applaud your Community Involvement"
    },
    {
        type: 4,
        message: "You stood up for a great social cause!!"
    },
    {
        type: 5,
        message: "Help with Assignments"
    },
    {
        type: 5,
        message: "Help with Research Paper"
    },
    {
        type: 5,
        message: "Car Pooling Service for Chores"
    },
    {
        type: 5,
        message: "Python Training"
    },
    {
        type: 5,
        message: "Digital Marketing Knowledge"
    },
    {
        type: 5,
        message: "Public Speaking Training"
    },
    {
        type: 5,
        message: "Music Lessons"
    },
    {
        type: 5,
        message: "Foreign Language Lessons"
    },
    {
        type: 5,
        message: "Statistics Tutoring"
    },
    {
        type: 5,
        message: "Data Analytics Tutoring"
    },
    {
        type: 5,
        message: "Costume Designing"
    },
    {
        type: 5,
        message: "Guitar Lessons"
    },
    {
        type: 5,
        message: "Baking Lessons"
    },
    {
        type: 5,
        message: "Hand Craft/Art Lessons"
    },
    {
        type: 5,
        message: "Salsa Lessons"
    },
    {
        type: 5,
        message: "Interview Prep Classes For Internship"
    },
    {
        type: 5,
        message: "How-to-be-an-Influencer Training"
    },
    {
        type: 5,
        message: "Yoga Lessons"
    },
    {
        type: 6,
        message: "Artwork"
    },
    {
        type: 6,
        message: "Write-up"
    },
    {
        type: 6,
        message: "Music Composition"
    },
    {
        type: 6,
        message: "Performance"
    },
    {
        type: 6,
        message: "Fashion Design"
    },
    {
        type: 7,
        message: "Go For Coffee"
    },
    {
        type: 7,
        message: "Go For a Movie"
    },
    {
        type: 7,
        message: "Plan A Quick Weekend Trip"
    },
    {
        type: 7,
        message: "Meet Someone New"
    },
    {
        type: 7,
        message: "Watch A Soccer Game"
    },
    {
        type: 7,
        message: "Go For Hiking/Biking"
    },
    {
        type: 7,
        message: "Watch A Basketball Game"
    },
    {
        type: 7,
        message: "Go To A Concert / Live Performance"
    }
]

async function castMessagesData() {

    try {

        const findCastMessages = await CastMessages.find({})

        if (findCastMessages.length == 0) {
            await CastMessages.insertMany(data);
        }

    } catch (error) {
        console.error('Error inserting data:', error);
    }
}

castMessagesData();