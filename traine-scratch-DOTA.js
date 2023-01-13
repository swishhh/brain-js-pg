const brain = require('brain.js');
const TrainStream = require('train-stream');
const fs = require('fs');

const DATASET = 'img/dota/dataset.json'
const OUTPUT_MODEL = 'trained_test.json';

const OUTPUT_GREEN = '\x1b[32m'
const OUTPUT_YELLOW = '\x1b[33m';
const OUTPUT_RED = '\x1b[31m';
const OUTPUT_CYAN = '\x1b[36m';

const network = new brain.NeuralNetwork({
    activation: 'sigmoid',
    learningRate: 0.1,
    hiddenLayers: [128, 128, 128],
    errorThresh: 0.00005
});

let data = fs.readFileSync(DATASET);
data = JSON.parse(data);

let testItemInput = data[0].input;
let testItemOutput = data[0].output;

function train(stream, data) {
    for (let i = 0; i < data.length; i++) {
        stream.write(data[i]);
    }
    outputTrainStatus(stream.i, stream.neuralNetwork.test([data[0]]).error)
    stream.endInputs();
}

function getColoredText(text, color) {
    return color + text + '\x1b[0m';
}

function outputTrainStatus(i, error) {
    let errorColor = OUTPUT_RED;
    if (error > 0.1 && error < 0.17) {
        errorColor = OUTPUT_YELLOW;
    } else if (error < 0.1) {
        errorColor = OUTPUT_GREEN;
    }
    console.log('Iteration: ' + getColoredText(i, OUTPUT_GREEN) + ' Error: ' + getColoredText(error, errorColor))
}

function outputTestPrediction(prediction, expectation) {
    let predictionEntries = Object.entries(prediction);
    let highestPrediction = predictionEntries.reduce(function (prev, current) {
        return (prev[1] > current[1] ? prev : current)
    });

    let accuracy = highestPrediction[1];
    let accuracyColor = OUTPUT_RED;
    if (accuracy > 0.9) {
        accuracyColor = OUTPUT_GREEN
    } else if (accuracy > 0.75) {
        accuracyColor = OUTPUT_YELLOW
    }

    console.log('\n' + getColoredText('Network training completed.', OUTPUT_GREEN))
    console.log(
        '\n' +
        'Test prediction: ' + getColoredText('"' + highestPrediction[0] + '"', OUTPUT_CYAN) + ' '
        + 'Accuracy: ' + getColoredText(highestPrediction[1], accuracyColor) + '\nExpected: '
        + getColoredText(expectation, expectation === highestPrediction[0] ? OUTPUT_GREEN : OUTPUT_RED)
    )
}

const trainStream = new TrainStream.TrainStream({
    neuralNetwork: network,
    floodCallback: () => {
        train(trainStream, data);
    },
    doneTrainingCallback: (stats) => {
        let prediction = network.run(testItemInput);
        let expectation = Object.keys(testItemOutput).shift();

        outputTestPrediction(prediction, expectation);

        let networkJSON = network.toJSON();
        fs.writeFileSync(OUTPUT_MODEL, JSON.stringify(networkJSON), 'utf-8');
    },
});

train(trainStream, data);

