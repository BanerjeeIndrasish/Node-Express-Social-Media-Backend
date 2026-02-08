import { Request, Response, NextFunction } from 'express';
import { uploadMultiple, uploadSingle } from '../config/multer';
import multer from 'multer';

class UploadMiddleware {
    // Handle single image upload
    static handleSingleUpload(req: Request, res: Response, next: NextFunction) {
        uploadSingle(req, res, (err: any) => {
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res.status(400).json({
                        success: false,
                        message: 'File size too large. Maximum size is 5MB'
                    });
                }
                return res.status(400).json({
                    success: false,
                    message: `Upload error: ${err.message}`
                });
            } else if (err) {
                return res.status(400).json({
                    success: false,
                    message: err.message
                });
            }
            next();
        });
    }

    // Handle multiple images upload
    static handleMultipleUpload(req: Request, res: Response, next: NextFunction) {
        uploadMultiple(req, res, (err: any) => {
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res.status(400).json({
                        success: false,
                        message: 'File size too large. Maximum size is 5MB per file'
                    });
                }
                if (err.code === 'LIMIT_FILE_COUNT') {
                    return res.status(400).json({
                        success: false,
                        message: 'Too many files. Maximum is 10 images'
                    });
                }
                return res.status(400).json({
                    success: false,
                    message: `Upload error: ${err.message}`
                });
            } else if (err) {
                return res.status(400).json({
                    success: false,
                    message: err.message
                });
            }
            next();
        });
    }

    // Validate if file exists
    static validateFileExists(req: Request, res: Response, next: NextFunction) {
        const hasFile = req.file || (Array.isArray(req.files) && req.files.length > 0);
        if (!hasFile) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }
        next();
    }
}

export default UploadMiddleware;