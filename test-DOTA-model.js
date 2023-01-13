const brain = require('brain.js');
const fs = require("fs");
const convert = require('./imageconverttotestable.js')

const modelString = fs.readFileSync('trained.json', "utf-8");
const modelJSON = JSON.parse(modelString);

convert.convert('img/dota-test/blnk.png', 128, 128).then(input => {
    const network = new brain.NeuralNetwork();
    network.fromJSON(modelJSON);

    var start = new Date().getTime();
    console.log(network.run(input));
    var end = new Date().getTime();
    var time = end - start;
    console.log('Execution time: ' + time);
})

