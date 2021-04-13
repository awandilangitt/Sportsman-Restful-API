const mongoose = require("mongoose");

const faqModel = new mongoose.Schema({
    title: {type: String, required: true},
    question: {type: String, required: true},
    description: {type: String, required: true},
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now},
});

module.exports = mongoose.model("Faq", faqModel);