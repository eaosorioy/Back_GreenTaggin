import { Router } from "express";

import { getUsers, putUser, postUser, patchUser, deleteUser } from "../controllers/user.js";

// check: es un middleware que me permite especificar que campo del body necesito revisar
import { check } from "express-validator";

// import validateJWT from "../middlewares/validate-jwt.js";
// import { validRole, containRole } from "../middlewares/validate-roles.js";
// import { validateFields } from "../middlewares/validate-fields.js";

import {
    validateJWT,
    validRole,
    containRole,
    validateFields
} from "../middlewares/index.js";

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
    validateJWT, // 1 - Valida que el usuario cuente con un token activo para poder continuar por esta ruta
    // validROLE, // 2 - Valida que el usuario cuente con el Rol respectivo para continuar con la ruta
    containRole('ADMIN_ROLE'), // 2 - Valida que el usuario cuente con el Rol ADMIN_ROLE para continuar con la ruta (Es diferente al validROLE)
    check('id', 'No es un ID válido').isMongoId().custom(existUserById), // 3 - Valida que el id sea válido de MongoDB y que el usuario exista en DB
    validateFields // 4 - Permite que las validaciones anteriores tengan error
], deleteUser);

export default router;