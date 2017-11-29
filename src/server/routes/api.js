const express = require('express')
const router = express.Router()

router.use(require('./sessions'))
router.use('/comment', require('./comment_api'))
router.use('/files', require('./files_api'))
router.use('/users', require('./users'))
router.use('/notifications',require('./notification_api'))
module.exports = router
