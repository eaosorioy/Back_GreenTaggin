import jwt from "jsonwebtoken";
import { request, response } from "express";
import User from "../models/user.js";

const validateJWT = async (req = request, res = response, next) => {
    
    //Obtener token de los header
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            message: 'No hay token en la peticion'
        })
    }

    try {
        //Verificamos el token
        const {uid} = jwt.verify(token, process.env.SECRETORPUBLICKEY);

        //Leer el usuario que corresponde al uid
        const user = await User.findById(uid);

        //validar si el usuario sigue activo
        if (!user) {
            return res.status(401).json({
                message: 'Token no válido - no existe usuario'
            })
        }

        if (!user.status) {
            return res.status(401).json({
                message: 'Token no válido - usuario inactivo'
            })
        }

        req.user = user;

        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            message: 'Token no válido'
        })
    }
}

export {
    validateJWT
};
