"use strict"
let FB = require('fb')
let fs = require('fs')
let fbConfig = require('./our-config.json')

if (fbConfig.access_token)
    FB.setAccessToken(fbConfig.access_token);

function auth() {
    var newPromise = new Promise(function (resolve, reject) {
        FB.api('oauth/access_token', {
            client_id: fbConfig.appId,
            client_secret: fbConfig.appSecret,
            grant_type: 'client_credentials'
        }, function (res) {
            if (!res || res.error) {
                console.log(!res ? 'error occurred' : res.error);
                reject();
            }
            else {
                resolve(res.access_token);
            }
        });
    });

    return newPromise
}

// writeFeed()
function writeFeed() {
    loadFeed()
    // .then(function (access_token) {
    //     // FB.setAccessToken(access_token);
    //     return loadFeed();
    // }, showError)
        .then(function (feed) {
            // console.log('done')

            var p = new Promise(function (resolve, reject) {
                fs.writeFile("./group_feed_result.json", JSON.stringify(feed, null, '\t'), function (err) {
                    if (err) {
                        reject()
                    }
                    else {
                        resolve()
                    }
                });
            })

            return p

        }, showError)
}


// loadFeedComments()

function loadFeedComments() {
    return new Promise(function (resolve, reject) {

        FB.api(
            '/1565410547086320/feed',
            'GET',
            {"fields": "id,message,comments.limit(99){from,message,id}"},
            function (response) {
                if (response && response.error) {
                    reject(response)
                    return
                }

                let feed = response.data
                fs.writeFile("./group_feed_result.json", JSON.stringify(feed, null, '\t'), function (err) {
                    if (err) {
                        reject(err)
                    }
                    else {
                        resolve()
                    }
                });
            }
        )
    })

}

function loadFeed() {
    return new Promise(function (resolve, reject) {

        FB.api('/' + fbConfig.groupId + '/feed?fields=id,message,link,created_time&limit=99', function (res) {
            if (res && res.error) {
                if (res.error.code === 'ETIMEDOUT') {
                    console.log('request timeout');
                }
                else {
                    console.log('error', res.error);
                }
                reject()
            }
            else {
                // console.log('Got data from feed');
                // console.log(res);
                resolve(res.data)
            }
        });
    })

};

function showError(error) {
    console.log(error)
}