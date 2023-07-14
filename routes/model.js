import { Router } from "express";

import { get_model } from "../controllers/model.js";

const router = Router();

router.get('/', get_model);

export default router;