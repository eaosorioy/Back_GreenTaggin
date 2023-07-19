import fs from "fs";
import path from 'path';
import XLSX from "xlsx";
import mongoose from "mongoose";
import { response } from "express";
import { fileURLToPath } from 'url';
import { create_model } from "./model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const insertKeywords = async (array) => {
  const collectionName = 'keywords'; // collection
  const db = mongoose.connection.db;
  const collection = db.collection(collectionName);

  // collection.drop();

  collection.insertMany(array)
    .then(result => {
      console.log('Keywords saved !!!');
    })
    .catch(error => {
      console.error('Error al guardar el documento:', error);
    });
}

const upload_keywords = (req, res = response) => {

  if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
    res.status(400).send('No hay archivos para subir');
    return;
  }

  const { file } = req.files;

  fs.readFile(file.tempFilePath, async (error, data) => {
    if (error) {
      console.error('Error al leer el archivo:', error);
    } else {
      const arrayBuffer = data;
      const workbook = XLSX.read(arrayBuffer, { type: 'buffer' });

      // Accede a la hoja de trabajo deseada (por ejemplo, la primera hoja)
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];

      // Convierte los datos de la hoja de trabajo a un objeto JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      await insertKeywords(jsonData);
    }
  });
}

const processHeaders = async ([firstHeader, secondHeader, threeHeader], model) => {

  let valueFirstHeader = null;

  threeHeader.forEach((element, i) => {
    if (firstHeader[i] === null) {
      firstHeader[i] = valueFirstHeader;
    }
    else if (firstHeader[i] === undefined) {
      firstHeader[i] = valueFirstHeader;
    }
    else {
      valueFirstHeader = firstHeader[i];
    }
  })

  let newHeaders = {};
  let lastHeaderExists = null;
  let lastHeaderTwoExists = null;

  threeHeader.forEach((eheader, h) => {
    if (firstHeader[h]) {
      lastHeaderExists = firstHeader[h];
      if (!newHeaders[lastHeaderExists]) {
        newHeaders[lastHeaderExists] = { indice: h };
      } else {
        newHeaders[lastHeaderExists] = { ...newHeaders[lastHeaderExists] };
      }
      if (secondHeader[h]) {
        lastHeaderTwoExists = secondHeader[h];
        newHeaders[lastHeaderExists][secondHeader[h]] = {
          ...newHeaders[lastHeaderExists][secondHeader[h]],
          [eheader]: {
            data: model.map(registro => registro[h])
          }
        }
      } else {
        if (newHeaders[lastHeaderExists][lastHeaderTwoExists]) {
          newHeaders[lastHeaderExists][lastHeaderTwoExists] = {
            ...newHeaders[lastHeaderExists][lastHeaderTwoExists],
            [eheader]: {
              data: model.map(registro => registro[h])
            }
          }
        } else {
          newHeaders[lastHeaderExists] = {
            ...newHeaders[lastHeaderExists],
            [eheader]: {
              data: model.map(registro => registro[h])
            }
          }
        }
      }
    } else {
      newHeaders[eheader] = {
        data: model.map(registro => registro[h])
      }
    }
  })

  return newHeaders;
}
const createModel = async (model) => {
  return new Promise((resolve, reject) => {

    let contentFile = 'import {Schema, model} from "mongoose";\n' +
      'const ModelSchema = Schema({\n';

    model[2].forEach((field) => {
      contentFile += '"' + field + '"' + ': String,\n';
    });

    contentFile += '});\n' +
      'export default model("Model", ModelSchema);\n\n' +
      '//import {Schema, model} from "mongoose";\n\n' +
      '//const ModelSchema = Schema({});\n\n' +
      '//export default model("Model", ModelSchema);';

    const filePath = path.join(__dirname, '../models', 'model.js');

    fs.writeFile(filePath, contentFile, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve('Archivo creado exitosamente: model.js');
      }
    });
  })
}
const transformModel = async (headers, result, arrModel) => {
  let [headerOne, headerTwo, headerThree] = headers;

  arrModel.forEach((emodel) => {

    emodel.forEach(() => {

      headerThree.forEach((ehThree) => {

        if (!result[ehThree]) {
          const uniqueArrayheaderOne = [...new Set(headerOne)];

          uniqueArrayheaderOne.forEach((ehOne) => {

            if (ehOne) {
              if (result[ehOne]) {
                const uniqueArrayheaderTwo = [...new Set(headerTwo)];

                uniqueArrayheaderTwo.forEach((ehTwo) => {

                  if (ehTwo && result[ehOne] && result[ehOne][ehTwo]) {

                    if (result[ehOne][ehTwo][ehThree]) {

                      result[ehThree] = {};

                      if (result[ehThree] && !result[ehThree].data) {
                        result[ehThree]['data'] = result[ehOne][ehTwo][ehThree].data;
                      }
                    }

                  } else {
                    if (ehTwo != null) {
                      if (result[ehOne][ehThree]) {

                        result[ehThree] = {};

                        if (result[ehThree] && !result[ehThree].data) {
                          result[ehThree]['data'] = result[ehOne][ehThree].data;
                        }
                      }
                    }
                  }

                })

              }
            }

          });

        }

      });

    });

  });

  const uniqueArrayheaderOne = [...new Set(headerOne)];
  uniqueArrayheaderOne.forEach((element) => {
    if (element) {
      delete result[element];
    }
  })

  return result;
}
const upload_model = async (req, res = response) => {

  try {
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
      res.status(400).send('No hay archivos para subir');
      return;
    }

    const { file } = req.files;

    const pathDirectory = path.join(__dirname, '../uploads/models/');

    if (!fs.existsSync(pathDirectory)) {
      fs.mkdirSync(pathDirectory, { recursive: true });
    }

    const uploadPath = path.join(pathDirectory + file.name);

    // const uploadPath = path.join(__dirname, '../uploads/models/' + file.name);

    file.mv(uploadPath, async (err) => {
      if (err) {
        return res.status(500).json({ err });
      }

      const workbook = XLSX.readFile(uploadPath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Obtener los encabezados de las columnas
      let arrModel = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
      const headers = arrModel.splice(0, 3);

      const result = await processHeaders(headers, arrModel);

      createModel(headers)
        .then(async () => {
          let respuesta = await transformModel(headers, result, arrModel);
          let insertion = await create_model(headers[2], respuesta);
          res.json({ message: 'Model created !!!', insertion });
        })
        .catch((error) => {
          console.error('Error al crear el archivo:', error);
          res.status(400).json({ message: error });
        });
    })

  } catch (error) {
    res.status(400).json({ message: error });
  }
}

const verify_file = (req, res = response) => {
  let { filename } = req.params;
  const filePath = path.join(__dirname, '../uploads/models/', `${filename}.xlsx`);
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    return res.status(200).json({
      message: 'Ok', status: 200, file: {
        name: `${filename}.xlsx`,
        size: stats.size,
        createdAt: stats.birthtime,
        modifiedAt: stats.mtime
      }
    });
  } else {
    return res.status(200).json({ message: 'El archivo no existe' }); // El archivo no existe
  }
};

export {
  upload_model,
  upload_keywords,
  verify_file
}