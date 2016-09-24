var natural = require('natural')

const places = {
    boulders: "boulders",
    blocksWalls: "b&w",
    dunno: "dunno???"
};

const idToAnswer = {
    "1565410547086320_1596549290639112": places.blocksWalls,
    "1565410547086320_1596109090683132": places.blocksWalls,
    "1565410547086320_1595411597419548": places.blocksWalls,
    "1565410547086320_1594827377477970": places.dunno,
    "1565410547086320_1594894500804591": places.dunno,
    "1565410547086320_1594157614211613": places.dunno,
    "1565410547086320_1594020064225368": places.dunno,
    "1565410547086320_1593824074244967": places.dunno,
    "1565410547086320_1592864154340959": places.dunno,
    "1565410547086320_1591942411099800": places.dunno,
    "1565410547086320_1591139231180118": places.boulders,
    "1565410547086320_1591098271184214": places.blocksWalls,
    "1565410547086320_1589232361370805": places.boulders,
    "1565410547086320_1589779417982766": places.dunno,
    "1565410547086320_1589360261358015": places.blocksWalls,
    "1565410547086320_1587625168198191": places.boulders,
    "1565410547086320_1586677121626329": places.blocksWalls,
    "1565410547086320_1585877558372952": places.boulders,
    "1565410547086320_1583500251944016": places.blocksWalls,
    "1565410547086320_1581022908858417": places.blocksWalls,
    "1565410547086320_1577894955837879": places.dunno,
    "1565410547086320_1576571602636881": places.blocksWalls,
    "1565410547086320_1574817266145648": places.boulders,
    "1565410547086320_1575306242763417": places.dunno,
    "1565410547086320_1574395709521137": places.dunno,
    "1565410547086320_1597232677237440": places.boulders,
}


function getFeed() {
    var d = require('./group_feed_result.json')
    return d;
}

(function() {
    let data = getFeed()
    let feed = data.data

    // let randomIndex = Math.floor(Math.random() * data.data.length)
    // test(data.data, randomIndex)
    // return;

    let score = 0;
    for (let i = 0; i < feed.length; i++) {
        let correct = test(feed, i);
        if (correct) {
            score++;
        }
    }
    console.log(score + " / " + data.data.length)
})()


function test(feed, subjectIndex) {

    let classifier = new natural.BayesClassifier()

    feed.forEach(function (item, index) {
        // console.log(!!idToAnswer[item.id])
        if (index != subjectIndex) {
            // console.log("addDocument...")
            let answer = idToAnswer[item.id]
            if (!answer) {
                console.log("SHOULD BE ANSWER HERE")
            }
            else {
                classifier.addDocument(item.message, answer);
            }
        }
    });

    classifier.train();

    let messageToClassify = feed[subjectIndex].message;
    let answer = classifier.classify(messageToClassify);
    console.log("-----")
    console.log("q: " + messageToClassify);
    console.log("a: " + answer );

    return idToAnswer[feed[subjectIndex].id] == answer;
}
