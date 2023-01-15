const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		category: {
			type: String,
			required: true,
			uppercase: true,
		},
		price: {
			type: Number,
			required: true,
		},
		images: [
			{
				type: String,
				required: true,
			},
		],
	},
	{ timestamps: true }
);
const Product = mongoose.model("Product", productSchema);

module.exports = { productSchema, Product };
