import multer from "multer";

import path from "path";

const dirname = import.meta.dirname;
const pathToImages = path.join(dirname, "../../public/images-temp");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, pathToImages);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const upload = multer({ storage });
