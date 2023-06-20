import fs from "fs";
import path from "path";
import * as XLSX from "xlsx";
import { dirname } from 'path';
import mongoose from "mongoose";
import { response } from "express";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const searchSectors = async (array) => {
  let sectores = [];

  [...new Set(array.map((x) => x.Sector))].forEach(async (sector, index) => {
    let section = sector.substring(sector.indexOf("(") + 1, sector.indexOf(")"));
    sectores.push({
      sector: sector.replace("(" + section + ")", "").trim(),
      section
    })
  });

  return sectores;
}
const insertSectors = async (array) => {
  const collectionName = 'sectors'; // collection
  const db = mongoose.connection.db;
  const collection = db.collection(collectionName);

  //collection.drop();

  collection.insertMany(array)
    .then(result => {
      console.log('Sectors saved !!!');
    })
    .catch(error => {
      console.error('Error al guardar el documento:', error);
    });
}

const searchCategories = async (array, sectors) => {

  const result = [];

  array.forEach((x) => {
    const sector = sectors.find((s) => `${s.sector} (${s.section})` === x['Sector']);
    if (sector) {
      const existingCategory = result.find((c) => c.categoria === x['Categoría'] && c.sector === sector._id);
      if (!existingCategory) {
        result.push({
          categoria: x['Categoría'],
          sector: sector._id,
        });
      }
    }
  });

  return result;
}
const insertCategories = async (array) => {
  const collectionName = 'categories'; // collection
  const db = mongoose.connection.db;
  const collection = db.collection(collectionName);

  //collection.drop();

  collection.insertMany(array)
    .then(result => {
      console.log('Categories saved !!!');
    })
    .catch(error => {
      console.error('Error al guardar el documento:', error);
    });
}

const searchActivity = async (array, categories) => {

  const result = [];

  array.forEach((x) => {
    const categoria = categories.find((s) => s.categoria === x['Categoría']);
    if (categoria) {
      const existingActivity = result.find((c) => c.activity === x['Proyecto / actividad a financiar'] && c.categoria === categoria._id);
      if (!existingActivity) {
        result.push({
          activity: x['Proyecto / actividad a financiar'],
          categoria: categoria._id,
        });
      }
    }
  });

  return result;
}
const insertActivity = async (array) => {
  const collectionName = 'activity'; // collection
  const db = mongoose.connection.db;
  const collection = db.collection(collectionName);

  //collection.drop();

  collection.insertMany(array)
    .then(result => {
      console.log('Activities saved !!!');
    })
    .catch(error => {
      console.error('Error al guardar el documento:', error);
    });
}

const buildModel = async (array, activities) => {

  array.forEach((x) => {
    const activity = activities.find((s) => s.activity === x['Proyecto / actividad a financiar']);
    if (activity) {
      x.activity_id = activity._id
    }
  });

  return array;
}

const insertModelTagging = async (array) => {
  const collectionName = 'modeltagging'; // collection
  const db = mongoose.connection.db;
  const collection = db.collection(collectionName);

  //collection.drop();

  collection.insertMany(array)
    .then(result => {
      console.log('Model tagging saved !!!');
    })
    .catch(error => {
      console.error('Error al guardar el documento:', error);
    });
}

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

const uploadFiles = (req, res = response) => {

  if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
    res.status(400).send('No hay archivos para subir');
    return;
  }

  sampleFile = req.files.file;

  const { file } = req.files;

    let jsonData = [];

    fs.readFile(file.tempFilePath, async (error, data) => {
      if (error) {
        console.error('Error al leer el archivo:', error);
      } else {
        const arrayBuffer = data;
        const workbook = XLSX.read(arrayBuffer, { type: 'buffer' });

        // Accede a la hoja de trabajo deseada (por ejemplo, la primera hoja)
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];

        // Convierte los datos de la hoja de trabajo a un objeto JSON
        jsonData = XLSX.utils.sheet_to_json(worksheet);

        // console.log(jsonData[0]);

        let filterSectors = await searchSectors(jsonData);
        await insertSectors(filterSectors);

        let filterCategories = await searchCategories(jsonData, filterSectors);
        await insertCategories(filterCategories);

        let filterActivity = await searchActivity(jsonData, filterCategories);
        await insertActivity(filterActivity);

        let modelBuilt = await buildModel(jsonData, filterActivity);
        await insertModelTagging(modelBuilt);

        res.json({ message: 'Model created !!!', model: modelBuilt });
      }
    });
}

const uploadKeywords = (req, res = response) => {

  if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
    res.status(400).send('No hay archivos para subir');
    return;
  }

  sampleFile = req.files.file;

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
      console.log(jsonData);

      await insertKeywords(jsonData);
    }
  });
}

export {
  uploadFiles,
  uploadKeywords
}