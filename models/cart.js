const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		image: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema);

module.exports = { Cart };
