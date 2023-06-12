import jwt from "jsonwebtoken";

const generarJWT = (uid = '') => {
    return new Promise((resolve, reject) => {

        /* 
            //------------------Estructura Token JWT----------------//
            Header
            Payload
            Firma(sign)
        */

        const payload = { uid };

        //Firma del token
        jwt.sign(payload, process.env.SECRETORPUBLICKEY, {
            expiresIn: '8h' //Expiración del token
        }, (err, token) => {
            if (err) {
                console.log(err)
                reject('No se pudo generar el token');
            } else {
                resolve(token);
            }
        })

    })
}

export default generarJWT;