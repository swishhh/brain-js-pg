const brain = require('brain.js');
const TrainStream = require('train-stream');
const fs = require('fs');

const network = new brain.NeuralNetwork({
    // inputSize: 128,
    // activation: 'relu',
    // learningRate: 0.1,
    hiddenLayers: [128, 128, 128, 128]
});

let dataset = fs.readFileSync('img/dataset_2_item.json');
let data = JSON.parse(dataset);
let testSet = fs.readFileSync('img/test_unknown_dataset.json');
testSet = JSON.parse(testSet);

let testInput = fs.readFileSync('img/fresh_hammer_test.json');
testInput = JSON.parse(testInput)[0].input;


// let data = [
//     {input: [1, 0], output: [1]},
//     {input: [0, 1], output: [0]},
//     {input: [0, 0], output: [0]},
//     {input: [1, 1], output: [1]}
// ];
// let testItem = [data[0]];

function readInputs(stream, data) {
    for (let i = 0; i < data.length; i++) {
        stream.write(data[i]);
    }
    // let test = stream.neuralNetwork.test(testSet);
    // console.log('Iteration: ' + stream.i + ' Accuracy: ' + test.accuracy + ' Error: ' + test.error)
    console.log('Iteration: ' + stream.i + ' Error: ' + stream.neuralNetwork.test([data[0]]).error)
    stream.endInputs();
}

const trainStream = new TrainStream.TrainStream({
    neuralNetwork: network,
    floodCallback: () => {
        readInputs(trainStream, data);
    },
    doneTrainingCallback: (stats) => {
        console.log(stats);
        console.log(network.run(testInput));
        let networkJSON = network.toJSON();
        fs.writeFileSync('trained.json', JSON.stringify(networkJSON), 'utf-8');
    },
});

// kick it off
readInputs(trainStream, data);


// let dataset = fs.readFileSync('img/dataset.json');
// dataset = JSON.parse(dataset);
//
// network.train(dataset)
//
// const output = network.run([1, 1]);

// console.log(output);