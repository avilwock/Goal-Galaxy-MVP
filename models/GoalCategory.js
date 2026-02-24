const mongoose = require("mongoose")
const {Schema, model} = mongoose;

const goalCategorySchema = new Schema ({
    categoryName: {
        type: String,
        required: true,
    },
    icon: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        description: "Category color (hex or tailwind)"
    },
    timestamps: true
});

module.exports = model ('goalCategory', goalCategorySchema);
