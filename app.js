/* This APP is genereted with 18.16.0 version node */

import dotenv from "dotenv"; // Me permite usarprocess.env.PORT (Variable global)

dotenv.config();

import Server from './models/server.js';

const server = new Server();

server.listen(); // Levanta el servidor

