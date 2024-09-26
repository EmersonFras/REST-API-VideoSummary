const User = require('../models/User')
const Video = require('../models/Video')
const asyncHandler = require('express-async-handler')


const getAllVideos = asyncHandler(async (req, res) => {
    const { userId } = req.query

    if (!userId) {
        return res.status(400).json({ message: 'User ID required'})
    }

    const user = await User.findById(userId).lean().exec()
    
    if (!user) {
        return res.status(400).json({ message: "Invalid ID"})
    }

    const videos = await Video.find( { user: userId }).lean().exec()

    if (!videos?.length) {
        return res.status(404).json({ message: 'No videos found'})
    }

    res.json(videos)
})

const createNewVideo = asyncHandler(async (req, res) => {
    const { title, description, videoUrl, user } = req.body;
    
    if (!title || !description || !videoUrl || !user) {
        return res.status(400).json({ message: 'All fields required'})
    }

    const userFound = await User.findById(user).lean().exec()

    if (!userFound) {
        return res.status(400).json({ message : 'Invalid User ID'})
    }

    
    const duplicate = await Video.findOne({ user: user, title: title }).lean().exec()
    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate video title'})
    }
    
    const videoObject = {title, description, videoUrl, user}
    const video = Video.create(videoObject)
    if (video) {
        return res.status(201).json({ message: `New video ${title} created`})
    } else {
        return res.status(400).json({ message: 'Invalid video data received' })
    }

})

const updateVideo = asyncHandler(async (req, res) => {
    const { _id: id, title, description, videoUrl, user } = req.body;

    if (!id || !title || !description || !videoUrl || !user) {
        return res.status(400).json({ message: 'All fields required'})
    }

    const userFound = await User.findById(user).exec()
    if (!userFound) {
        return res.status(400).json({ message: 'Invalid User ID'})
    }

    const video = await Video.findById(id).exec()
    if (!video) {
        return res.status(400).json({ message: "Invalid video ID"})
    }

    // Check for duplicate
    const duplicate = await Video.findOne({ user : user, title: title }).lean().exec()
    // Allow updates to the original user
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate video title'})
    }

    video.title = title
    video.description = description
    video.videoUrl = videoUrl
    video.user = user

    const updatedVideo = await video.save()

    res.json({ message: `${updatedVideo.title} updated`})
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { _id: id, user } = req.body;

    if (!id || !user) {
        return res.status(400).json({ message: 'All fields required'})
    }

    const userFound = await User.findById(user).exec()

    if (!userFound) {
        return res.status(400).json({ message: 'Invalid User ID'})
    }

    const video = await Video.findById(id).exec()

    if (!video || video.user.toString() !== user) {
        return res.status(400).json({ message: 'Invalid video ID'})
    }

    const deletedVideo = await Video.findByIdAndDelete(id).lean().exec()

    res.json({ message: `${deletedVideo.title} deleted`})
})

module.exports = {
    getAllVideos,
    createNewVideo,
    updateVideo,
    deleteVideo
}