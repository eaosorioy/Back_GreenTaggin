import { log } from "console";
import Model from '../models/model.js';
import Sector from '../models/sector.js';
import Category from '../models/category.js';
import Activity from '../models/activity.js';
import ClimateTarget from '../models/climate-target.js';

/* Logica de creación de modelo */
const buildDataInsertion = async (header, data) => {
    let newData = [];

    header.forEach((element, i) => {
        data[element]['data'].forEach((edata, j) => {
            if (!newData[j]) {
                newData[j] = {}; // Crea un objeto vacío si no existe en la posición j
            }
            newData[j][element] = edata;
        })
    });

    return newData;
}

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
const insert_sectors = async (array) => {
    return new Promise((resolve, reject) => {
        Sector.deleteMany()
            .then(() => {
                Sector.insertMany(array)
                    .then(result => {
                        // console.log('Sectors saved !!!');
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

const searchClimateTarget = async (array) => {
    let climateTarget = [];

    [...new Set(array.map((x) => x['Objetivo climático']))].forEach(async (climate_target, index) => {
        climateTarget.push({
            name: climate_target,
        })
    });

    return climateTarget;
}
const insert_climate_target = async (array) => {
    return new Promise((resolve, reject) => {
        ClimateTarget.deleteMany()
            .then(() => {
                ClimateTarget.insertMany(array)
                    .then(result => {
                        // console.log('Sectors saved !!!');
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

const searchCategories = async (array, climateTarget) => {
    let categories = [];

    array.forEach((x) => {
        const climateTargetSearch = climateTarget.find((s) => s.name === x['Objetivo climático']);
        if (climateTargetSearch) {
            const existingCategory = categories.find((c) => c.name === x['Categoría macro'] && c.climate_target_id === climateTargetSearch._id);
            if (!existingCategory) {
                categories.push({
                    name: x['Categoría macro'],
                    climate_target_id: climateTargetSearch._id
                });
            }
        }
    })

    return categories;
}
const insert_categories = async (array) => {
    return new Promise((resolve, reject) => {
        Category.deleteMany()
            .then(() => {
                Category.insertMany(array)
                    .then(result => {
                        // console.log('Sectors saved !!!');
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

const searchActivities = async (array, sectors, categories) => {
    let activities = [];
    array.forEach((x) => {
        const sector = sectors.find((s) => `${s.sector} (${s.section})` === x['Sector']);
        const categoria = categories.find((s) => s.categoria === x['Categoría']);
        if (categoria) {
            const existingActivity = activities.find((c) => c.finance === x['Proyecto / actividad a financiar'] && c.category_id === categoria._id);
            if (!existingActivity) {
                activities.push({
                    sector_id: sector._id,
                    category_id: categoria._id,
                    finance: x['Proyecto / actividad a financiar'],
                    examples: x['Ejemplos del proyecto / actividad'],
                    description: x['Descripción del proyecto / actividad'],
                });
            }
        }
    })

    return activities;
}
const insert_activities = async (array) => {
    return new Promise((resolve, reject) => {
        Activity.deleteMany()
            .then(() => {
                Activity.insertMany(array)
                    .then(result => {
                        // console.log('Sectors saved !!!');
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

const searchModel = async (array, activities) => {

    let model = []

    array.forEach((x) => {
        const activity = activities.find((a) => a.finance === x['Proyecto / actividad a financiar']);
        if (activity) {
            model.push({
                ...x,
                'Proyecto / actividad a financiar': activity._id
            })
        }
    })

    return model;
}
const insert_model = async (array) => {
    return new Promise((resolve, reject) => {
        Model.deleteMany()
            .then(() => {
                Model.insertMany(array)
                    .then(result => {
                        // console.log('Sectors saved !!!');
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

const create_model = async (header, data) => {

    const dataInsertion = await buildDataInsertion(header, data);

    const sectors = await searchSectors(dataInsertion);
    const sectorsInserted = await insert_sectors(sectors);

    const climateTarget = await searchClimateTarget(dataInsertion);
    const climateTargetInserted = await insert_climate_target(climateTarget);

    const categories = await searchCategories(dataInsertion, climateTargetInserted);
    const categoriesInserted = await insert_categories(categories);

    const activity = await searchActivities(dataInsertion, sectorsInserted, categoriesInserted);
    const activityInserted = await insert_activities(activity);

    const model = await searchModel(dataInsertion, activityInserted);
    const modelInserted = await insert_model(model);
    // log('%c//--------------------------------//', 'color: yellow');
    // log(activityInserted);

    return modelInserted;
}
/* Fin Logica de creación de modelo */

const get_model = async (req = request, res = response) => {
    try {
        const model = await Model.find();
        res.status(200).json({ message: 'Ok', status: 200, model });
    } catch (error) {
        res.status(400).json({ message: 'Error', status: 400, error });
    }
}

export {
    create_model,
    get_model
}