import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import { response } from "express";
import User from '../models/user.js';
import generarJWT from '../helpers/generarJWT.js';

const login = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        //Verificar si el email existe
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: 'Correo incorrecto !'
            })
        }

        //Verificar si el usuario sigue activo
        if (!user.status) {
            return res.status(400).json({
                message: 'Usuario inactivo !'
            })
        }

        //Verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, user.password);// Match de passwords
        if (!validPassword) {
            return res.status(400).json({
                message: 'Contraseña incorrecta !'
            })
        }

        //Generar JWT
        const token = await generarJWT(user.id);

        res.json({
            user,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Hable con el administrador'
        })
    }

}

const validToken = async (req, res = response) => {

    const token = req.headers.authorization.split(' ')[1];

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

        return res.status(200).json({ message: 'Token válido', user, token });
        
    } catch (error) {
        console.log(error);
        res.status(401).json({
            message: 'Token no válido'
        })
    }

}

export {
    login,
    validToken
}