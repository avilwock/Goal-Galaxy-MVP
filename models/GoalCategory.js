const mongoose = require("mongoose")
const {Schema, model} = mongoose;

const goalCategorySchema = new Schema ({
    categoryName: {
        type: String,
        required: true,
        description: "Category Name"
    },
    icon: {
        type: String,
        required: true,
        description: "lucide icon name"
    },
    color: {
        type: String,
        description: "Category color (hex or tailwind)"
    },
    timestamps: true
});

module.exports = model('GoalCategory', goalCategorySchema);
