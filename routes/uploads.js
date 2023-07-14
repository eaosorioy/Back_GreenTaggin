import { Router } from "express";

import { upload_model, upload_keywords, verify_file } from "../controllers/uploads.js";

const router = Router();

router.post('/upload_model', upload_model);
router.post('/upload_keywords', upload_keywords);
router.post('/verify_file/:filename', verify_file);

export default router;