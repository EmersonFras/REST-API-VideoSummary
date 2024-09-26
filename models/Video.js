const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose)

const videoSchema = new mongoose.Schema(
    {
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    videoUrl: {
        type: String,  // URL to the video in GridFS or external storage
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',  // Links to the user's account
    },
    },
    {
        timestamps: true
    }
);

videoSchema.plugin(AutoIncrement, {
    inc_field: 'uploads',
    id: 'uploadNums',
    start_seq: 1
})

module.exports = mongoose.model('Video', videoSchema);