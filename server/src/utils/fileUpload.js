const fs = require('fs');
const path = require('path');
const multer = require('multer');
const ServerError = require('../errors/ServerError');
const env = process.env.NODE_ENV || 'development';
const devImagePath = path.resolve(__dirname, '..', '..', '..', 'public/images');
const devFilePath = path.resolve(__dirname, '..', '..', '..', 'public/files');

const fileImagesPath =
  env === 'production' ? '/var/www/html/images/' : devImagePath;
const fileFilesPath =
  env === 'production' ? '/var/www/html/files/' : devFilePath;

if (!fs.existsSync(fileImagesPath)) {
  fs.mkdirSync(fileImagesPath, {
    recursive: true,
  });
}
if (!fs.existsSync(fileFilesPath)) {
  fs.mkdirSync(fileFilesPath, {
    recursive: true,
  });
}

const storageContestFiles = multer.diskStorage({
  destination (req, file, cb) {
    cb(null, fileFilesPath);
  },
  filename (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});
const storageOffersFiles = multer.diskStorage({
  destination (req, file, cb) {
    cb(null, fileImagesPath);
  },
  filename (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});
const storageUserFiles = multer.diskStorage({
  destination (req, file, cb) {
    cb(null, fileImagesPath);
  },
  filename (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const uploadAvatars = multer({ storage: storageUserFiles }).single('file');
const uploadContestFiles = multer({ storage: storageContestFiles }).array(
  'files',
  3
);
const updateContestFile = multer({ storage: storageContestFiles }).single(
  'file'
);
const uploadLogoFiles = multer({ storage: storageOffersFiles }).single(
  'offerData'
);

module.exports.uploadAvatar = (req, res, next) => {
  uploadAvatars(req, res, err => {
    if (err instanceof multer.MulterError) {
      next(new ServerError());
    } else if (err) {
      next(new ServerError());
    }
    return next();
  });
};

module.exports.uploadContestFiles = (req, res, next) => {
  uploadContestFiles(req, res, err => {
    if (err instanceof multer.MulterError) {
      next(new ServerError());
    } else if (err) {
      next(new ServerError());
    }
    return next();
  });
};

module.exports.updateContestFile = (req, res, next) => {
  updateContestFile(req, res, err => {
    if (err instanceof multer.MulterError) {
      next(new ServerError());
    } else if (err) {
      next(new ServerError());
    }
    return next();
  });
};

module.exports.uploadLogoFiles = (req, res, next) => {
  uploadLogoFiles(req, res, err => {
    if (err instanceof multer.MulterError) {
      next(new ServerError());
    } else if (err) {
      next(new ServerError());
    }
    return next();
  });
};
