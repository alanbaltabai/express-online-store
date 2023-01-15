const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const controller = require("../controllers/controller");

const { checkAuthenticated } = require("../middlewares/auth");

router
	.route("/:_id")
	.get(checkAuthenticated, controller.order_get)
	.delete(controller.order_delete);

module.exports = router;
