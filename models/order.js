const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	telephone: {
		type: String,
		required: true,
	},
	address: {
		type: String,
		required: true,
	},
	mail: {
		type: String,
	},
	payment: {
		type: String,
		required: true,
	},
	comment: {
		type: String,
	},
	check: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: "Check",
	},
	createdAt: {
		type: String,
	},
});

const Order = mongoose.model("Order", orderSchema);

module.exports = { Order };
