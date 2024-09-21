import admin from "firebase-admin";
import serviceAccount from '../../../ikonic-989ef-firebase-adminsdk-a9jjt-ffa0275287.json';

export default admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});