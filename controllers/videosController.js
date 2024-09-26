const User = require('../models/User')
const Video = require('../models/Video')
const asyncHandler = require('express-async-handler')


const getAllVideos = asyncHandler(async (req, res) => {
    const { userID } = req.query
    if (!userId) {
        return res.status(400).json({ message: 'User ID required'})
    }

    const user = await User.findById(userID).lean().exec()

    if (!user) {
        return res.status(400).json({ message: "Invalid ID"})
    }

    const videos = await Video.find( { uploadedBy: userId }).lean().exec()

    res.json(videos)
})

const createNewVideo = asyncHandler(async (req, res) => {
    const { title, description, videoUrl, user } = req.body;
    
    if (!title || !description || !videoUrl || !user) {
        res.status(400).json({ message: 'All fields required'})
    }

    const userFound = User.findById(user).lean().exec()
    if (!userFound) {
        res.status(400).json({ message : 'Invalid User ID'})
    }

    const videoObject = {title, description, videoUrl, user}

    const video = Video.create(videoObject)
    if (video) {
        res.status(201).json({ message: `New video ${title} created`})
    } else {
        res.status(400).json({ message: 'Invalid video data received' })
    }

})

const updateVideo = asyncHandler(async (req, res) => {
    const { id, title, description, videoUrl, user } = req.body;

    if (!title || !description || !videoUrl || !user) {
        res.status(400).json({ message: 'All fields required'})
    }

    const userFound = User.findById(user).exec()
    if (!userFound) {
        res.status(400).json({ message: 'Invalid User ID'})
    }

    const video = Video.findById(id).exec()
    if (!video) {
        res.status(400).json({ message: "Invalid video ID"})
    }

    // Check for duplicate
    const duplicate = await Video.findOne({ uploadedBy : user, title: title }).lean().exec()
    // Allow updates to the original user
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate video title'})
    }

    video.title = title
    video.description = description
    video.videoUrl = video.videoUrl
    video.user = user

    const updatedVideo = await video.save()

    res.json({ message: `${updatedVideo.title} updated`})
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { id } = req.body;

    if (!id) {
        res.status(400).json({ message: 'ID required'})
    }

    const video = Video.findById(id).exec()

    if (!video) {
        res.status(400).json({ message: 'Invalid video ID'})
    }

    const deletedVideo = await Video.findByIdAndDelete(id).lean().exec()

    res.json({ message: `${deletedVideo.title} deleted`})
})