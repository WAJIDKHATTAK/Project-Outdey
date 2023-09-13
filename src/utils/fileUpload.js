const multer = require("multer");
const path = require("path");

// Define storage for images and documents
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		if (file.fieldname === "document") {
			// Destination folder for documents
			cb(null, "public/uploads/documents/");
		} else {
			// Destination folder for images
			cb(null, "public/uploads/images/");
		}
	},
	filename: (req, file, cb) => {
		cb(
			null,
			file.fieldname + "-" + Date.now() + path.extname(file.originalname),
		);
	},
});

// Define file filter for allowed file types
const fileFilter = (req, file, cb) => {
	const allowedImageMimeTypes = [
		"image/png",
		"image/jpg",
		"image/jpeg",
		"image/svg",
		"image/svg+xml",
	];
	const allowedDocumentMimeTypes = ["application/pdf", "text/plain"];

	if (
		file.fieldname === "document" &&
		allowedDocumentMimeTypes.includes(file.mimetype)
	) {
		cb(null, true);
	} else if (allowedImageMimeTypes.includes(file.mimetype)) {
		cb(null, true);
	} else {
		cb(new Error("File type not allowed"), false);
	}
};

// Create a multer instance with the storage and fileFilter
const upload = multer({ storage, fileFilter });

module.exports = upload;

// const multer = require("multer");
// const path = require("path");

// const storage = multer.diskStorage({
// 	destination: (req, file, cb) => {
// 		cb(null, "public/uploads/");
// 	},

// 	// By default, multer removes file extensions so let's add them back
// 	filename: (req, file, cb) => {
// 		// eslint-disable-next-line prefer-template
// 		cb(
// 			null,
// 			file.fieldname + "-" + Date.now() + path.extname(file.originalname),
// 		);
// 	},
// });

// const fileFilter = (req, file, cb) => {
// 	if (
// 		file.mimetype === "image/png" ||
// 		file.mimetype === "image/jpg" ||
// 		file.mimetype === "image/jpeg" ||
// 		file.mimetype === "image/PNG" ||
// 		file.mimetype === "image/JPG" ||
// 		file.mimetype === "image/JPEG" ||
// 		file.mimetype === "image/svg" ||
// 		file.mimetype === "image/SVG" ||
// 		file.mimetype === "image/svg+xml"
// 	) {
// 		cb(null, true);
// 	} else {
// 		return cb(new Error("Only image allowed"), false);
// 	}
// };

// const fileUpload = multer({ storage, fileFilter });

// module.exports = {
// 	fileUpload,
// };
