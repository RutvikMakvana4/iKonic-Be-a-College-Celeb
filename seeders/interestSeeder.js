import Interests from "../model/interests";
import { baseUrl } from "../src/common/constants/configConstants";

const data = [
    {
        image: baseUrl("images/interests/sports.png"),
        name: "Sports"
    },
    {
        image: baseUrl("images/interests/fashion.png"),
        name: "Fashion"
    },
    {
        image: baseUrl("images/interests/fitness.png"),
        name: "Fitness"
    },
    {
        image: baseUrl("images/interests/movies.png"),
        name: "Movies"
    },
    {
        image: baseUrl("images/interests/art.png"),
        name: "Art"
    },
    {
        image: baseUrl("images/interests/technology.png"),
        name: "Technology"
    },
    {
        image: baseUrl("images/interests/food.png"),
        name: "Food"
    },
    {
        image: baseUrl("images/interests/books.png"),
        name: "Books"
    },
    {
        image: baseUrl("images/interests/business.png"),
        name: "Business"
    },
]

async function interestsData() {

    try {

        const findInterests = await Interests.find({})

        if (findInterests.length == 0) {
            await Interests.insertMany(data);
        }

    } catch (error) {
        console.error('Error inserting data:', error);
    }
}

interestsData();