const express = require("express")
const router = express.Router()
const upload = require("../helpers/multer")
const user_controllers = require("../controllers/user")
const auth = require("../middlewares/auth")

router.post("/register",upload.single("avatar"),user_controllers.register)
router.post("/login",user_controllers.login)
router.get("/profile",auth,user_controllers.user_profile)
router.patch("/update-profile",auth,upload.single("avatar"),user_controllers.update_profile)
router.delete("/delete",auth,user_controllers.delete_profile)
router.post("/logout",auth,user_controllers.logout_user)



module.exports = router