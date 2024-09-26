const express = require('express')
const router = express.Router()
const videosController = require('../controllers/videosController')

router.route('/')
    .get(videosController.getAllvideos)
    .post(videosController.createNewVideo)
    .patch(videosController.updateVideo)
    .delete(videosController.deleteVideo)

module.exports = router