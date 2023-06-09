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

export {
    login
}