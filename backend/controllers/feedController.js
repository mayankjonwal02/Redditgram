const express = require('express')

const router = express.Router()

const {RedditLogin,fetchGeneralFeed,fetchSpecificFeed,fetchSpecificPost, savepost, unsavepost, getSavedPosts, ifUserHasSavedPost,fetchcredits } = require("../services/feedService")


router.post("/generalfeed",fetchGeneralFeed)
router.post("/specificfeed",fetchSpecificFeed)
router.post("/specificpost",fetchSpecificPost)
router.post("/savepost",savepost)
router.post("/unsavepost",unsavepost)
router.post("/getsavedposts",getSavedPosts)
router.post("/ifusersavedpost",ifUserHasSavedPost)
router.get("/fetchcredits",fetchcredits)

module.exports = router