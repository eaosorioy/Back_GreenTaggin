import { Router } from "express";

import { get_model, get_sectors } from "../controllers/model.js";

const router = Router();

router.get('/', get_model);
router.get('/sectors', get_sectors);

export default router;