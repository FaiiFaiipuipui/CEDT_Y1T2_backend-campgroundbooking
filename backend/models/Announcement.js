const mongoose = require('mongoose')

const AnnouncementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: ['Please add a title ',true]
    },
    content: {
        type: String,
        required: ['Please add a content',true]
    },
    startDate: {
        type: Date,
        required: ['Please add a start date',true],
        default: Date.now
    },
    endDate: {
        type: Date | null,
        required: ['Please add an end date',true],
    },
    campground: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campground',
        required: true
    },
    author: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Announcement', AnnouncementSchema);