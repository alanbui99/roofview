const express = require("express");
const router = express.Router();

const {validateRooftop, isLoggedIn, isAdmin} = require("../middleware/index");

const rooftopsController = require("../controllers/rooftops.controller");

//INDEX - show a list of rooftops
router.get('/', rooftopsController.getList)

//NEW - show form to create new rooftop
// middleware.isLoggedIn, 
router.get("/new", isAdmin, rooftopsController.getNew);
//CREATE - add new rooftop to DB
router.post("/new", isAdmin, validateRooftop('new'), rooftopsController.postNew);
//EDIT - show form to edit rooftop info
// middleware.checkrooftopOwnership, 
router.get("/:id/edit", isAdmin, rooftopsController.getEdit)
// middleware.checkrooftopOwnership, 
router.put("/:id/edit", isAdmin, validateRooftop('edit'), rooftopsController.putEdit)
//SHOW - show more info about one rooftop
router.get("/:id", rooftopsController.getRooftop);
//DELETE - delete one rooftop
router.delete("/:id", isAdmin, rooftopsController.deleteRooftop)

module.exports = router;