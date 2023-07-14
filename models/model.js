import {Schema, model} from "mongoose";
const ModelSchema = Schema({
"# ID": String,
"Objetivo climático": String,
"Sector": String,
"Categoría macro": String,
"Subcategoría": String,
"Proyecto / actividad a financiar": String,
"Descripción del proyecto / actividad": String,
"Ejemplos del proyecto / actividad": String,
"Criterio adicional a evaluar para ser considerado mitigación / adaptación ": String,
"Referencia de criterios adicionales a evaluar": String,
"Fuente de referencias de criterios": String,
"¿Es climática?": String,
"Principios comunes para el seguimiento de la financiación de la mitigación del cambio climático - Tabla": String,
"Principios comunes para el seguimiento de la financiación de la mitigación del cambio climático - Actividad subvencionable": String,
"Principios comunes para el seguimiento de la financiación de la adaptación al cambio climático Paso 1: ¿Vulnerabilidad? ": String,
"Principios comunes para el seguimiento de la financiación de la adaptación al cambio climático Paso 2: ¿Intención de reducir la vulnerabilidad?": String,
"Principios comunes para el seguimiento de la financiación de la adaptación al cambio climático Paso 3: ¿Vínculo entre actividad y vulnerabilidad?": String,
"Tipo 1: ¿Actividades que se adaptan?, Tipo 2: ¿Actividades con objetivos compartidos de adaptación/desarrollo? o Tipo 3: ¿Actividades que permiten la adaptación?": String,
"Alineamiento taxonomía UE": String,
"Alineamiento taxonomía CBI": String,
"Alineamiento ICMA": String,
"Alineamiento Taxonomía verde de Colombia ": String,
"Clasificación de impacto ambiental y social  (esta categoría es referencial y se sugiere que sea revisada por el oficial de riesgos correspondiente)": String,
"Restricción por impacto ambiental y social ": String,
"Detalle de la restricción por impacto ambiental y social ": String,
"Indicador 1": String,
"Indicador 2": String,
"Indicador 3": String,
});
export default model("Model", ModelSchema);

//import {Schema, model} from "mongoose";

//const ModelSchema = Schema({});

//export default model("Model", ModelSchema);