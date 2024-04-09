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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

//Campground populated with virtual
AnnouncementSchema.virtual("campground",{
    ref: 'Campground',
    localField: '_id',
    foreignField: 'campground',
    justOne: true,
})

//Author populate with virtual [necessary]
// AnnouncementSchema.virtual("author",{
//     ref: 'User',
//     localField: '_id',
//     foreignField: 'author',
//     justOne: true,
// });

module.exports = mongoose.model('Announcement', AnnouncementSchema);