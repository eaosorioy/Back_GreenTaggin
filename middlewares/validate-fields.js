import { validationResult } from 'express-validator';

const validateFields = (req, res, next)=> {
    const errors = validationResult(req); //Funciona gracias al middelware de la ruta (check) que valida si algun campo no cumple con alguna validación

    if(!errors.isEmpty()){
        return res.status(400).json(errors);
    }

    // Deja pasar en caso tal de no existir errores en las validaciones
    next();
}

export {
    validateFields
}