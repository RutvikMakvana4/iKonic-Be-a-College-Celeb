import passport from "passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JWT } from "../constants/constants";
import AccessToken from "../../../model/accessToken";

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT.SECRET
}

passport.use(new Strategy(options, async (payload, done) => {
    try {
        const decodedData = JSON.parse(payload.data)

        const checkToken = await AccessToken.findOne({
            userId: decodedData.user,
            token: decodedData.jti
        });

        if (!checkToken) {
            return done(null, false)
        }

        const user = decodedData.user
        return done(null, user)
    } catch (error) {
        console.log(error);
        return done(error, false);
    }
}));