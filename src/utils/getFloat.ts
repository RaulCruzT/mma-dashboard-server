import mongoose from "mongoose";

export default function getFloat(value: mongoose.Types.Decimal128) {
    if (typeof value !== 'undefined') {
        return parseFloat(value.toString());
    }
    return value;
}