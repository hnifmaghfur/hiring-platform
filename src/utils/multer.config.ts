import { diskStorage, Options } from 'multer';
import { extname } from 'path';

export const multerConfig: Options = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + extname(file.originalname));
    },
  }),
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(pdf|doc|docx)$/)) {
      return cb(null, false); // Reject file, no error
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
};
