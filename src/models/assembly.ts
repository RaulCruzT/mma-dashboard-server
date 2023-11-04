import { Schema, InferSchemaType, model } from 'mongoose';

const assemblySchema = new Schema({
    creator: { type: Schema.Types.ObjectId, required: true, ref: "User", select: false },
    actinobacteria: { type: Schema.Types.ObjectId, required: true, ref: "Actinobacteria", select: false },
    date: { type: Date, required: true },
    bgcs: { type: String, match: [/^(http|https):\/\/[^ "]+$/, 'Please enter a valid URL.'] },
    softwareTrimming: { type: String, required: true },
    softwareAssembly: { type: String, required: true },
    parametersAssembly: { type: String, required: true },
    qualityFinal: { type: String, required: true },
    comments: { type: String },
    link: { type: String, match: [/^(http|https):\/\/[^ "]+$/, 'Please enter a valid URL.'] },
    sequencingTechnology: { type: String, required: true },
    accessionNumber: { type: String },
    paper: { type: String },
}, { timestamps: true });

type Assembly = InferSchemaType<typeof assemblySchema>;

export default model<Assembly>("Assembly", assemblySchema);