
import cors from "cors"; // Me permiten especificar quienes pueden hacer petiicones al API
import express from "express";
import fileUpload from "express-fileupload";

//Routes
import authRoutes from "../routes/auth.js";
import userRoutes from "../routes/user.js";
import uploadRoutes from "../routes/uploads.js";
import modelRoutes from "../routes/model.js";

import { dbConnection } from "../database/config.js";

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        //Paths routes
        this.userPath = '/api/user';
        this.authPath = '/api/auth';
        this.uploadsPath = '/api/uploads';
        this.modelPath = '/api/model';

        //Connect DB
        this.connectDB();

        //Middlewares (Funciones adicionales del servidor)
        this.middlewares();

        //Routes
        this.routes();
    }

    async connectDB() {
        await dbConnection();
    }

    middlewares() {
        this.app.use(cors()); // CORS
        this.app.use(express.json()); //Lectura y parseo del body (formato json)
        this.app.use(express.static('public'));// Directorio publico

        /* file upload */
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/'
        }));
    }

    routes() {
        this.app.use(this.authPath, authRoutes);
        this.app.use(this.userPath, userRoutes);
        this.app.use(this.uploadsPath, uploadRoutes);
        this.app.use(this.modelPath, modelRoutes);
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en el puerto:', this.port);
        });
    }

}

export default Server;