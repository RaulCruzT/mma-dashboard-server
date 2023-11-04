import { Schema, InferSchemaType, model } from 'mongoose';

const processedDataSchema = new Schema({
    creator: { type: Schema.Types.ObjectId, required: true, ref: "User", select: false },
    actinobacteria: { type: Schema.Types.ObjectId, required: true, ref: "Actinobacteria", select: false },
    massDetection: {type: String },
    chromatogramBuilder: {type: String },
    deconvolution: {type: String },
    isotope: {type: String },
    filtered: {type: String },
    identification: {type: String },
    alignment: {type: String },
    gapFilling: {type: String },
    comments: {type: String },
    dataSource: {type: String, required: true },
    equipment: {type: String, required: true },
    fileName: {type: String, required: true },
    massIVEID: {type: String },
    link: { type: String, match: [/^(http|https):\/\/[^ "]+$/, 'Please enter a valid URL.'] },
}, { timestamps: true });

type ProcessedData = InferSchemaType<typeof processedDataSchema>;

export default model<ProcessedData>("ProcessedData", processedDataSchema);