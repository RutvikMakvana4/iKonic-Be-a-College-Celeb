import SubCulture from "../model/subCultures";
import { baseUrl } from "../src/common/constants/configConstants";

const data = [
    {
        image: baseUrl("images/subCultures/goths.png"),
        name: "Goths"
    },
    {
        image: baseUrl("images/subCultures/preps.png"),
        name: "Preps"
    },
    {
        image: baseUrl("images/subCultures/emos.png"),
        name: "Emos"
    },
    {
        image: baseUrl("images/subCultures/jocks.png"),
        name: "Jocks/Athletes"
    },
    {
        image: baseUrl("images/subCultures/nerds.png"),
        name: "Nerds/Geeks"
    },
    {
        image: baseUrl("images/subCultures/skaters.png"),
        name: "Skaters"
    },
    {
        image: baseUrl("images/subCultures/hipsters.png"),
        name: "Hipsters"
    },
    {
        image: baseUrl("images/subCultures/sceneKids.png"),
        name: "Scene Kids"
    },
    {
        image: baseUrl("images/subCultures/artists.png"),
        name: "Artists/Creatives"
    },
    {
        image: baseUrl("images/subCultures/techEnthusiats.png"),
        name: "Tech Enthusiasts"
    },
]

async function subCulturesData() {

    try {

        const findInterests = await SubCulture.find({})

        if (findInterests.length == 0) {
            await SubCulture.insertMany(data);
        }

    } catch (error) {
        console.error('Error inserting data:', error);
    }
}

subCulturesData();