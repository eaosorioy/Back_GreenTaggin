import { Router } from "express";

import { getUsers, putUsers, postUsers, patchUsers, deleteUsers } from "../controllers/user.js";

const router = Router();

router.get('/', getUsers);

router.put('/:id', putUsers);

router.post('/', postUsers);

router.patch('/', patchUsers);

router.delete('/', deleteUsers);

export default router;