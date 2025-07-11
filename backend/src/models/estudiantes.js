/*
Estudiantes 

firstName,
lastName,
birthDate,
dui,
password,
email,
phone,

*/

import { Schema, model } from "mongoose";

const estudiantesSchema = new Schema(
    {
        carnet:
        {
            type: String,
            required: true
        },

        nombre:
        {
            type: String,
            required: true
        },

        apellido:
        {
            type: String,
            required: true
        },

        grado:
        {
            type: String,
            required: true
        },

        estado:
        {
            type: String,
            required: true
        }
    },
    {
        timestamps: true,
        strict: false
    }
)

export default model("Estudiantes", estudiantesSchema);