"use strict";

var natural = require('natural')


class QuestionsAnswers {

    constructor() {

        this.answers = {
            boulders: "boulders",
            blocksWalls: "b&w",
            dunno: "dunno???"
        }

        let places = this.answers

        this.idToAnswer = {
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

        this.questions = require('./group_feed_result.json');

    }

    runAgainstFeed () {
        var origFeed = this.questions;
        // let randomIndex = Math.floor(Math.random() * data.data.length)
        // test(data.data, randomIndex)
        // return;

        let total = origFeed.length

        let reducedFeed = origFeed.filter( (item) => {
            return !!this.idToAnswer[item.id]
        })

        let score = reducedFeed.reduce( (previousScore, feedItem, index, currentArray) => {
            let correct = QuestionsAnswers.test(currentArray, index, this.idToAnswer);
            if (correct === true) {
                return previousScore + 1
            }
            else {
                return previousScore
            }
        }, 0);

        console.log(`Result: ${ Math.round(score/reducedFeed.length * 100000) / 1000}% correct. skipped ${total - reducedFeed.length}`)
    }


    static test(feed, subjectIndex, idToAnswer) {

        let classifier = new natural.BayesClassifier()

        feed.forEach(function (item, index) {
            // console.log(!!idToAnswer[item.id])
            if (index != subjectIndex) {
                // console.log("addDocument...")
                let answer = idToAnswer[item.id]
                if (!answer) {
                    console.log("missing answer, skipping")
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

}

const questions = new QuestionsAnswers();
questions.runAgainstFeed()

