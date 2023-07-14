
import {Schema, model} from 'mongoose';

const ActivitySchema = Schema({
    sector_id: {
        type: String
    },
    category_id: {
        type: String
    },
    finance: {
        type: String
    },
    description: {
        type: String
    },
    examples: {
        type: String
    },

});

export default model('Activity', ActivitySchema);