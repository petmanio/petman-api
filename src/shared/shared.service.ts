import * as path from 'path';
import { Injectable } from '@nestjs/common';
import { MulterOptions } from '@nestjs/common/interfaces/external/multer-options.interface';

@Injectable()
export class SharedService {

  static getMulterConfig(dest): MulterOptions {
    return {
      dest, fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
          return cb(null, true);
        }
        cb('Error: File upload only supports the following filetypes - ' + filetypes);
      },
    };
  }
}
