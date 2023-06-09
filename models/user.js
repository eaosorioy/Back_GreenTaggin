
import {Schema, model} from 'mongoose';

const UserSchema = Schema({
    img: {
        type: String
    },
    rol: {
        type: String,
        required: true,
        // enum: ['ADMIN_ROLE', 'USER_ROLE']
    },
    name: {
        type: String,
        required:[true, 'El nombre es obligatorio']
    },
    email: {
        type: String,
        unique: true,
        required:[true, 'El correo es obligatorio']
    },
    status: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required:[true, 'La contraseña es obligatoria']
    },
});

// Aca puedo incluso sobreescribir metodos propios del modelo, como finOne y demas...
UserSchema.methods.toJSON = function() {
    const {__v, password, _id, ...user} = this.toObject(); // toOBJECT() me genera uns instancia pero con el contexto de la funcion toJSON, es decir me deja trabajar con sus valores respectivos (name, email, rol, etc...)
    user.uid = _id;
    return user; // Estoy diciendo que cuando retorne la respuesta de algun metodo excluya __v y password
}

export default model('User', UserSchema);