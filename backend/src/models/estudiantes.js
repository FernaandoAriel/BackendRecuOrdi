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
        firstName:
        {
            type: String,
            required: true
        },

        lastName:
        {
            type: String,
            required: true
        },

        birthDate:
        {
            type: Date,
            required: true
        },

        dui:
        {
            type: String,
            required: true
        },

        password:
        {
            type: String,
            required: true
        },

        email:
        {
            type: String,
            required: true
        },

        phone:
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