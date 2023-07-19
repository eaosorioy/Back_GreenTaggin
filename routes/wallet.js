import { Router } from "express";

import { get_wallet, create_wallet, update_wallet, delete_wallet } from "../controllers/wallet.js";

const router = Router();

router.get('/', get_wallet);
router.post('/create', create_wallet);
router.put('/update/:id', update_wallet);
router.delete('/delete', delete_wallet);

export default router;