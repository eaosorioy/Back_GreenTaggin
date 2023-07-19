import {Schema, model} from "mongoose";
const WalletSchema = Schema({
"Agrupación 1": String,
"Agrupación 2": String,
"ID": String,
"Sector o subsector": String,
"Descripción": String,
"Monto": String,
_id_sector_model: String,
});
export default model("Wallet", WalletSchema);

//import {Schema, model} from "mongoose";

//const WalletSchema = Schema({});

//export default model("Wallet", WalletSchema);