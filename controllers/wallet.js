
import fs from "fs";
import path from 'path';
import XLSX from "xlsx";
import { fileURLToPath } from 'url';
import Wallet from "../models/wallet.js";
import { request, response } from "express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const create_model_wallet = (headers) => {
    return new Promise((resolve, reject) => {

        let contentFile = 'import {Schema, model} from "mongoose";\n' +
            'const WalletSchema = Schema({\n';

        headers.forEach((field) => {
            contentFile += `"${field}": String,\n`;
        });

        contentFile += '_id_sector_model: String,\n';

        contentFile += '});\n' +
            'export default model("Wallet", WalletSchema);\n\n' +
            '//import {Schema, model} from "mongoose";\n\n' +
            '//const WalletSchema = Schema({});\n\n' +
            '//export default model("Wallet", WalletSchema);';

        const filePath = path.join(__dirname, '../models', 'wallet.js');

        fs.writeFile(filePath, contentFile, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve('Archivo creado exitosamente: wallet.js');
            }
        });
    })

}

const process_data_wallet = async (headers, arrWallet) => {
    let wallet = [];
    arrWallet.forEach((ewallet, i) => {
        ewallet.forEach((element, j) => {
            if (!wallet[i]) {
                wallet[i] = {};
            }
            wallet[i][headers[j]] = element;
        })
    })
    return wallet;
}

const insert_wallet = async (array) => {
    return new Promise((resolve, reject) => {
        Wallet.deleteMany()
            .then(() => {
                console.log('Wallets deleted !!!');
                Wallet.insertMany(array)
                    .then(result => {
                        console.log('Wallets saved !!!');
                        return resolve(result);
                    })
                    .catch(error => {
                        console.error('Error al guardar el documento:', error);
                        return reject(error);
                    });
            })
            .catch(error => {
                console.error('Error al guardar el documento:', error);
                return reject(error);
            });
    })
}

const create_wallet = (req = request, res = response) => {

    try {
        if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
            res.status(400).json({ message: 'No hay archivos para subir' });
            return;
        }

        const { file } = req.files;

        const pathDirectory = path.join(__dirname, '../uploads/wallets/');

        if (!fs.existsSync(pathDirectory)) {
            fs.mkdirSync(pathDirectory, { recursive: true });
        }

        const uploadPath = path.join(pathDirectory + file.name);

        file.mv(uploadPath, async (err) => {
            if (err) {
                return res.status(500).json({ err });
            }

            const workbook = XLSX.readFile(uploadPath);
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            const arrWallet = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
            const headers = arrWallet.splice(0, 1)[0].map(x => x.trim());

            create_model_wallet(headers)
                .then(async () => {
                    const walletProccesed = await process_data_wallet(headers, arrWallet);
                    const walletInserted = await insert_wallet(walletProccesed);
                    return res.json({ message: 'Cartera creada con exito !', walletInserted });
                })
                .catch((err) => {
                    console.log(err);
                    return res.status(400).json({ message: 'Algo salio mal !' })
                });

        })


    } catch (error) {
        res.status(400).json({ message: error });
    }
}

const get_wallet = async (req = request, res = response) => {
    try {
        const wallet = await Wallet.find();
        res.status(200).json({ message: 'Ok', status: 200, wallet });
    } catch (error) {
        res.status(400).json({ message: 'Error', status: 400, error });
    }
}

const update_wallet = async (req = request, res = response) => {

    const { id } = req.params;
    const body = req.body;

    const userDB = await Wallet.findByIdAndUpdate(id, body);

    res.status(200).json(userDB);
}

const delete_wallet = async (req = request, res = response) => {
    Wallet.deleteMany()
        .then(() => {
            res.status(200).json({message: 'Deleted !'});
         })
        .catch(error => {
            console.error('Error al eliminar el documento:', error);
            res.status(400).json({message: error})
        });
}

export {
    get_wallet,
    create_wallet,
    update_wallet,
    delete_wallet
}