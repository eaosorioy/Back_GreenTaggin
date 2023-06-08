import Role from "../models/role.js";
import User from "../models/user.js";

const isRoleValid = async (rol) => { //custom recibe la propiedad rol del body
    const existRole = await Role.findOne({ rol });
    if (!existRole) { //Si no se cumple entonces pasa la validación
        throw new Error(`El rol ${rol} no esta registrado en la DB`); //Error personalizado
    }
}

const existEmail = async (email) => { //custom recibe la propiedad email del body
    const existEmail = await User.findOne({ email });
    if (existEmail) { //Si no se cumple entonces pasa la validación
        throw new Error(`El correo ${email} ya esta registrado`); //Error personalizado
    }
}

const existUserById = async (id) => { //custom recibe la propiedad User del body
    const existUser = await User.findById(id);
    if (!existUser) { //Si no se cumple entonces pasa la validación
        throw new Error(`El ID ${id} no existe`); //Error personalizado
    }
}

export {
    existEmail,
    isRoleValid,
    existUserById
}