import { Router } from "express";
import { check } from "express-validator";

import { login, validToken } from "../controllers/auth.js";
import {
    validateFields
} from "../middlewares/index.js";

import { uploadFiles, uploadKeywords } from "../controllers/uploads.js";

const router = Router();

router.post('/', uploadFiles);
router.post('/uploadKeywords', uploadKeywords);

export default router;