import { Router } from "express";
import { check } from "express-validator";

import { login, validToken } from "../controllers/auth.js";
import {
    validateFields
} from "../middlewares/index.js";

const router = Router();

router.post('/login', [
    check('email', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validateFields
], login);

router.get('/check-token', validToken);

export default router;