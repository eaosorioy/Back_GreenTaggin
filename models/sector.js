
import {Schema, model} from 'mongoose';

const SectorSchema = Schema({
    sector: {
        type: String
    },
    section: {
        type: String
    },
});

export default model('Sector', SectorSchema);