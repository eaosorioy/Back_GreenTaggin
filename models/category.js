
import {Schema, model} from 'mongoose';

const CategorySchema = Schema({
    name: {
        type: String
    },
    climate_target_id: {
        type: String
    },
});

export default model('Category', CategorySchema);