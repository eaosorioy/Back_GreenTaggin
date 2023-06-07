import { response, request } from 'express';

const getUsers = (req = request, res = response) => {

    // Query params (Vienen como parametros en la ruta que son opcionales por lo que no hay que definirlos en los routes del get en este caso)
    const query = req.query;

    res.json({
        query,
        message: 'GET API - Controlador'
    });
}

const postUsers = (req, res = response) => {
    const {name, age} = req.body;
    res.json({
        age,
        name,
        message: 'POST API - Controlador'
    });
}

const putUsers = (req, res = response) => {

    // Parametro de segmento (Se envia por la ruta y se debe especificar en la ruta put en este caso de los routes (/:id))
    const {id} = req.params;

    res.json({
        id,
        message: 'PUT API - Controlador'
    });
}

const patchUsers = (req, res = response) => {
    res.json({
        message: 'PATCH API - Controlador'
    });
}

const deleteUsers = (req, res = response) => {
    res.json({
        message: 'DELETE API - Controlador'
    });
}

export {
    getUsers,
    putUsers,
    postUsers,
    patchUsers,
    deleteUsers,
}