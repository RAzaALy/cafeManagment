// routes/cafeRoutes.js

const express = require('express');
const router = express.Router();
const { getAllCafes, createCafe, updateCafe, deleteCafe, getCafeImage } = require('../controllers/cafeController');
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const crypto = require("crypto");
const path = require("path");

// Configure multer and GridFS storage
const storage = new GridFsStorage({
    url: process.env.DB_URL,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }

                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads'
                };
                resolve(fileInfo);
            });
        });
    }
});

const upload = multer({ storage: storage });

// Define routes
router.get('/', getAllCafes);
router.post('/', upload.single('image'), createCafe);
router.put('/:id', upload.single('image'), updateCafe);
router.delete('/:id', deleteCafe);
router.get('/image/:id', getCafeImage);

module.exports = router;
