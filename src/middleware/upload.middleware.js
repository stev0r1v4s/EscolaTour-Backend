import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure upload directories exist
const uploadDirs = ['uploads', 'uploads/images', 'uploads/documents', 'uploads/avatars'];
uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'image') {
      cb(null, 'uploads/images');
    } else if (file.fieldname === 'pedagogicalGuide') {
      cb(null, 'uploads/documents');
    } else if (file.fieldname === 'avatar') {
      cb(null, 'uploads/avatars');
    } else {
      cb(null, 'uploads');
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'image' || file.fieldname === 'avatar') {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('El archivo debe ser una imagen válida (jpeg, png, webp, etc.)'), false);
    }
  } else if (file.fieldname === 'pedagogicalGuide') {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('La guía pedagógica debe ser un archivo PDF'), false);
    }
  } else {
    cb(null, true);
  }
};

export const uploadDestinationFiles = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 15 * 1024 * 1024 // 15MB limit
  }
}).fields([
  { name: 'image', maxCount: 1 },
  { name: 'pedagogicalGuide', maxCount: 1 }
]);

export const uploadAvatarFile = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
}).single('avatar');
