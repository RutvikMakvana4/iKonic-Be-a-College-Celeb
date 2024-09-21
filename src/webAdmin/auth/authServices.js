import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "../../../model/admin";
import { JWT, BCRYPT } from "../../common/constants/constants";

class authServices {
  /**
   * @description: Login page load
   * @param {*} req
   * @param {*} res
   */
  static async index(req, res) {
    if (req.session.token) {
      jwt.verify(req.session.token, JWT.SECRET, (err, decoded) => {
        if (err) {
          return res.render("webAdmin/login");
        } else {
          return res.redirect("/webAdmin/dashboard");
        }
      });
    } else {
      return res.render("webAdmin/login");
    }
  }

  /**
   * @description: Login with email
   * @param {*} data
   * @param {*} req
   * @param {*} res
   */
  static async login(data, req, res) {
    try {
      const { email, password } = data;

      const findAdmin = await Admin.findOne({ email: email });

      if (!findAdmin) {
        req.flash("error", "Invalid Email");
        return res.redirect("back");
      }

      const checkPassword = await bcrypt.compare(password, findAdmin.password);

      if (!checkPassword) {
        req.flash("error", "Invalid Password");
        return res.redirect("back");
      }

      const payload = { id: findAdmin._id };

      jwt.sign(
        payload,
        JWT.SECRET,
        { expiresIn: JWT.EXPIRES_IN },
        (err, token) => {
          if (err) {
            return res.render("webAdmin/error/404");
          }

          req.session.token = token;
          return res.redirect("/webAdmin/dashboard");
        }
      );
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * @description : change password page
   * @param {*} req
   * @param {*} res
   */
  static async changePasswordPage(req, res) {
    return res.render("webAdmin/password/changePassword");
  }

  /**
   * @description : change password
   * @param {*} data
   * @param {*} req
   * @param {*} res
   */
  static async changePassword(data, auth, req, res) {
    const { currentPassword, newPassword, confirmNewPassword } = data;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      req.flash("error", "All fields are required.");
      return res.redirect("back");
    }

    const findAdmin = await Admin.findOne({ _id: auth });

    const isCurrentPasswordCorrect = await bcrypt.compare(
      currentPassword,
      findAdmin.password
    );

    if (!isCurrentPasswordCorrect) {
      req.flash(
        "error",
        "Your current password is not correct. Please try again."
      );
      return res.redirect("back");
    }

    if (newPassword !== confirmNewPassword) {
      req.flash("error", "New Password and Confirm New Password do not match.");
      return res.redirect("back");
    }

    const hashPass = await bcrypt.hash(newPassword, 10);

    await Admin.findOneAndUpdate(findAdmin._id, { password: hashPass });
    req.flash("success", "Password changed successfully.");
    req.session.destroy();
    return res.redirect("/webAdmin/login");
  }
}

export default authServices;
