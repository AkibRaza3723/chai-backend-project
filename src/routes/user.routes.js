import { Router } from "express";
import { logInUser, logOutUser, refreshAccessToken, registerUser } from "../controllers/user.ctlrs.js";
import {upload} from "../middlewares/multer.js"
import {varifyJWT} from "../middlewares/auth.mw.js"

// http:localhost8000/api/v1/users iske baad ke sare routes yaha likhenge
const router = Router()
//"router tumko ek route batata hu"
router.route("/register").post(upload.fields([
    {name : "avatar", maxCount:1},
    {name : "coverImage", maxCount:1}
]),registerUser) //middleware ijected 

router.route("/login").post(logInUser)

//secured routes
router.route("/logout").post(varifyJWT,logOutUser)
router.route("/refresh-token").post(refreshAccessToken) //while using refresh tokens we don't need to varify jwt

export default router
//export default ho rha ho to man chaha naam de skte import ke waqt
//We can use random names on import because a default export is assigned to a specific, single slot named default under the hood. When you import a default export without curly braces {}, JavaScript does not look for a matching variable name; it simply takes whatever is stored in that fallback default slot and lets you assign it to any local variable name you choose