const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const controller = require("../controllers/controller");
const { upload } = require("../middlewares/multer");
const {
	checkAuthenticated,
	checkNotAuthenticated,
} = require("../middlewares/auth");

const urlencodedParser = bodyParser.urlencoded({ extended: false }); // create application/x-www-form-urlencoded parser, for parsing encoded form data
let jsonParser = bodyParser.json(); // create application/json parser

router
	.route("/logadmin")
	.get(checkNotAuthenticated, controller.log_admin_get)
	.post(urlencodedParser, controller.log_admin_post);

router
	.route("/madmin")
	.get(checkAuthenticated, controller.admin_get)
	.post(jsonParser, controller.admin_post)
	.delete(controller.admin_delete);

router
	.route("/create-checkout-session")
	.post(jsonParser, controller.checkout_session);

router.get("/create", checkAuthenticated, controller.product_create_get);

router
	.route("/cart")
	.get(controller.cart)
	.post(jsonParser, controller.product_add_cart)
	.delete(jsonParser, controller.cart_product_delete);

router
	.route("/checkout")
	.get(controller.checkout)
	.post(jsonParser, controller.checkout_post);

router.route("/checkout2").get(controller.checkout2);

router
	.route("/")
	.get(controller.index)
	.post(upload.array("images", 4), controller.product_create_post);

router
	.route("/:title")
	.get(controller.product_get)
	.delete(controller.product_delete);

module.exports = router;
