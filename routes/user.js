import { Router } from "express";

import { getUsers, putUser, postUser, patchUser, deleteUser } from "../controllers/user.js";
// check: es un middleware que me permite especificar que campo del body necesito revisar
import { check } from "express-validator";
import { validateFields } from "../middlewares/validate-fields.js";
import { isRoleValid, existEmail, existUserById } from "../helpers/db-validators.js";

const router = Router();

router.get('/', getUsers);

router.post('/', [
    check('email', 'El correo no es valido').isEmail().custom(existEmail),
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'La contraseña debe tener mas de 6 carateres').isLength({ min: 6 }),
    check('rol').custom(isRoleValid), //Validar rol
    validateFields
], postUser);

router.put('/:id', [
    check('id', 'No es un ID válido').isMongoId().custom(existUserById),
    check('rol').custom(isRoleValid), //Validar rol
    validateFields
], putUser);

router.patch('/', [check('email', 'El correo no es valido').isEmail().custom(existEmail),], patchUser);

router.delete('/:id', [
    check('id', 'No es un ID válido').isMongoId().custom(existUserById),
    validateFields
], deleteUser);

export default router;