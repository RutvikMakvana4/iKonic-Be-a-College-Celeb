import castController from "./castController";
import express from "express";
import asyncWrap from "express-async-wrapper";
import authentication from "../../common/middleware/authentication";
import storeFile from "../../common/middleware/storeImage";
import storeFiles from "../../common/middleware/multerImageStore";
import validator from "../../common/config/joiValidation";
import { CastDto } from "./dtos/castDto";

const routes = express.Router();

// routes.post('/create-cast', authentication, storeFile('public/cast', 'uploadFile'), validator.body(CastDto), asyncWrap(castController.createCast));

const fields = [
    { name: "uploadFile", destination: "public/cast" },
    { name: "thumbnail", destination: "public/thumbnail" },
    { name: "uploadFiles", destination:"public/photoCast"}
];
routes.post('/create-cast', authentication, storeFiles(fields), validator.body(CastDto), asyncWrap(castController.createCast));

routes.delete('/delete-cast/:id', authentication, asyncWrap(castController.deleteCast));
routes.get('/view-cast/:id', authentication, asyncWrap(castController.viewCast));
routes.put('/edit-cast/:id', authentication, asyncWrap(castController.editCast));

module.exports = routes;
