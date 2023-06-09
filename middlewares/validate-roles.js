import { request, response } from "express";

const validRole = (req = request, res = response, next) => {

    if (!req.user) {
        return res.status(500).json({
            message: 'Se quiere verificar el rol sin validar el token primero'
        });
    }

    const { rol, name } = req.user;
    if (rol !== 'ADMIN_ROLE') {
        return res.status(401).json({
            message: `${name} no tiene permisos de administrador`
        });
    }

    next();
}

const containRole = ( ...roles ) => {

    return (req = request, res = response, next) => {
        
        if (!req.user) {
            return res.status(500).json({
                message: 'Se quiere verificar el rol sin validar el token primero'
            });
        }

        if (!roles.includes(req.user.rol)) {
            return res.status(401).json({
                message: `El servicio requiere uno de estos roles ${roles}`
            })
        }

        next();
    }
}

export {
    validRole,
    containRole
};