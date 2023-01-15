const mongoose = require("mongoose");

const checkSchema = mongoose.Schema(
	{
		sumValue: Number,
		totalValue: Number,
		productTitlesArray: [],
		productQuantitiesArray: [],
	},
	{ timestamps: true }
);

const Check = mongoose.model("Check", checkSchema);

module.exports = { Check };
