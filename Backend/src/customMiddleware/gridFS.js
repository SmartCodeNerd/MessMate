import { GridFSBucket } from 'mongodb';
import mongoose from 'mongoose';
import multer from 'multer';

let gridfsBucket;

// Initialize GridFSBucket once MongoDB is connected
mongoose.connection.once('open', () => {
  gridfsBucket = new GridFSBucket(mongoose.connection.db, {
    bucketName: 'uploads'
  });
});

const gridfs = {
  openUploadStream: (...args) => {
    if (!gridfsBucket) throw new Error('GridFSBucket not initialized');
    return gridfsBucket.openUploadStream(...args);
  },
  find: (...args) => {
    if (!gridfsBucket) throw new Error('GridFSBucket not initialized');
    return gridfsBucket.find(...args);
  },
  openDownloadStreamByName: (...args) => {
    if (!gridfsBucket) throw new Error('GridFSBucket not initialized');
    return gridfsBucket.openDownloadStreamByName(...args);
  }
};

// Multer setup: memory storage
const memoryUpload = multer({ storage: multer.memoryStorage() });

/**
 * Middleware to upload files from req.files[fieldname] to GridFS
 * @param {object} gridfsInstance
 */
const uploadTo = (gridfsInstance) => async (req, res, next) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) return next();

    const uploadedFiles = {};

    const fields = Object.keys(req.files);

    for (const field of fields) {
      const file = req.files[field][0]; // support only 1 file per field

      const stream = gridfsInstance.openUploadStream(file.originalname, {
        contentType: file.mimetype,
        metadata: { originalname: file.originalname, field }
      });

      stream.end(file.buffer);

      await new Promise((resolve, reject) => {
        stream.on('finish', () => {
          uploadedFiles[field] = {
            fileName: file.originalname,
            fileUrl: `${process.env.BASE_URL}/api/files/${encodeURIComponent(file.originalname)}`,
            uploadedAt: new Date(),
            contentType: file.mimetype
          };
          resolve();
        });
        stream.on('error', reject);
      });
    }

    req.uploadedFiles = uploadedFiles; // store in req
    next();
  } catch (err) {
    console.error('GridFS Upload Error:', err);
    res.status(500).json({ success: false, message: 'File upload failed.' });
  }
};

// File download route
const downloadRoute = async (req, res) => {
  try {
    const { filename } = req.params;
    const files = await gridfs.find({ filename }).toArray();
    if (!files || files.length === 0) {
      return res.status(404).json({ success: false, message: 'File not found' });
    }

    res.set({
      'Content-Type': files[0].contentType || 'application/octet-stream',
      'Content-Disposition': `inline; filename="${encodeURIComponent(files[0].filename)}"`
    });

    const downloadStream = gridfs.openDownloadStreamByName(filename);
    downloadStream.pipe(res);

    downloadStream.on('error', (err) => {
      console.error('Stream error:', err);
      res.status(500).json({ success: false, message: 'Error streaming file' });
    });
  } catch (err) {
    console.error('Download error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export { memoryUpload, uploadTo, downloadRoute, gridfs };