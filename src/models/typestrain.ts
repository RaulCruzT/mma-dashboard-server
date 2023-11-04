import { Schema, InferSchemaType, model } from 'mongoose';

const typeStrainSchema = new Schema({
    name: { type: String, required: true, unique: true },
    creator: { type: Schema.Types.ObjectId, required: true, ref: "User", select: false },
}, { timestamps: true });

type TypeStrain = InferSchemaType<typeof typeStrainSchema>;

export default model<TypeStrain>("TypeStrain", typeStrainSchema);