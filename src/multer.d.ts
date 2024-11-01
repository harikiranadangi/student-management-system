declare module 'multer' {
    import { RequestHandler } from 'express';
    
    interface Multer {
        memoryStorage: () => any;
        (options?: any): RequestHandler;
    }

    const multer: Multer;
    export default multer;
}
