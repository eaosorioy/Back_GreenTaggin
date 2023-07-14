import {Schema, model} from 'mongoose';

const ClimateTargetSchema = Schema({
    name: {
        type: String
    }
});

export default model('ClimateTarget', ClimateTargetSchema);