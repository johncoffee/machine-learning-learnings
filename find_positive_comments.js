const natural = require('natural')
const fs = require('fs')

const answers = {

}

let comments = require('./feed_comments_result.json')

var objects = {}
comments.forEach(function (feedItem) {

    if (feedItem.comments) {
        feedItem.comments.data.forEach((comment) => {
            objects[comment.id] = comment.message
        })
    }
})

fs.writeFile(`./comments_answers_result.json`, JSON.stringify( objects, null, '\t'))





