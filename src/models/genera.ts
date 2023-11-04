import { Schema, InferSchemaType, model } from 'mongoose';

const generaSchema = new Schema({
    name: { type: String, required: true, unique: true },
    creator: { type: Schema.Types.ObjectId, required: true, ref: "User", select: false },
}, { timestamps: true });

type Genera = InferSchemaType<typeof generaSchema>;

export default model<Genera>("Genera", generaSchema);