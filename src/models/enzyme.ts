import { Schema, InferSchemaType, model } from 'mongoose';

const enzymeSchema = new Schema({
    name: { type: String, required: true, unique: true },
    creator: { type: Schema.Types.ObjectId, required: true, ref: "User", select: false },
}, { timestamps: true });

type Enzyme = InferSchemaType<typeof enzymeSchema>;

export default model<Enzyme>("Enzyme", enzymeSchema);