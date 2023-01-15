const multer = require("multer");

const upload = multer({
	storage: multer.diskStorage({
		destination: function (request, file, callback) {
			callback(null, "./public/uploads");
		},
		filename: function (request, file, callback) {
			callback(null, Date.now() + file.originalname);
		},
	}),
});

module.exports = { upload };
