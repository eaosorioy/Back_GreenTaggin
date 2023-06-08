import { response, request } from 'express';
import bcryptjs from 'bcryptjs';

import User from '../models/user.js';

const getUsers = async (req = request, res = response) => {

    const { limit = 5, page = 0 } = req.query;
    const query = { status: true };

    /*
    //-----------------------------------------DOCUMENTACIÓN-----------------------------------------//
        const users = await User.find(query) //status para traer los usuarios activos
            .skip(Number(page)) // Desde que registro quiero mostrar
            .limit(Number(limit)); // Limite de datos de la consulta

        const total = await User.countDocuments(); //Total de usuarios

        // NOTA: este Promiseall() reemplaza lo comentado arriba
                - Tener en cuenta: El await para que espere la respuesta de todas las promesas
                - Tener en cuenta: Que es porque ambas promesas no dependen de la otra
                - Tener en cuenta: Que reduce tiempos de respuesta
                - Tener en cuenta: Me permite enviar un array con todas las promesas que se estan ejecutando, en este caso los awaits anteriores
    //-----------------------------------------DOCUMENTACIÓN-----------------------------------------//
    */
    const [total, users] = await Promise.all([// Se desestructura para poder segmentar las respuestas
        User.countDocuments(query),
        User.find(query)
            .skip(Number(page))
            .limit(Number(limit))
    ]);

    res.json({
        total,
        users
    });
}

const postUser = async (req, res = response) => {

    const { name, email, password, rol } = req.body;
    const user = new User({ name, email, password, rol });

    //Encriptar contraseña (Hash)
    const salt = bcryptjs.genSaltSync(10); //Numero de vueltas de encriptado
    user.password = bcryptjs.hashSync(password, salt); //Encriptación de una sola via

    //Guardar en DB
    await user.save();

    //Respuesta al cliente
    res.json(user);
}

const putUser = async (req, res = response) => {

    // Parametro de segmento (Se envia por la ruta y se debe especificar en la ruta put en este caso de los routes (/:id))
    const { id } = req.params;
    // Discriminamos del body algunos parametros que no necesito
    const { _id, password, google, ...user } = req.body;

    //TODO Validar contra DB
    if (password) {
        //Encriptar contraseña (Hash)
        const salt = bcryptjs.genSaltSync(10); //Numero de vueltas de encriptado
        user.password = bcryptjs.hashSync(password, salt); //Encriptación de una sola via
    }

    const userDB = await User.findByIdAndUpdate(id, user);

    res.json(userDB);
}

const patchUser = (req, res = response) => {
    res.json({
        message: 'PATCH API - Controlador'
    });
}

const deleteUser = async (req, res = response) => {
    
    const { id } = req.params;

    //Borrado fisicamente
    // const user = await User.findByIdAndDelete(id);

    //Borrado lógico
    const user = await User.findByIdAndUpdate(id, {status: false});

    res.json(user);
}

export {
    getUsers,
    putUser,
    postUser,
    patchUser,
    deleteUser,
}