import { JWT } from "../../common/constants/constants";
import jwt from "jsonwebtoken";

export default (req, res, next) => {
  if (req.session.token) {
    jwt.verify(req.session.token, JWT.SECRET, (err, decoded) => {
      if (err) {
        return res.redirect("/webAdmin/login");
      } else {
        req.user = decoded.id;
        next();
      }
    });
  } else {
    return res.redirect("/webAdmin/login");
  }
};
