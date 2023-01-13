const jimp = require('jimp');
const fs = require('fs');

const DIRECTORY = 'img/dota';
const IMAGE_WIDTH = 128;
const IMAGE_HEIGHT = 128;

function buildImages() {
    let images = [];
    let directoryItems = fs.readdirSync(DIRECTORY);
    for (let i = 0; i < directoryItems.length; i++) {
        let imageName = directoryItems[i];
        let key = imageName.split('.').shift();
        let output = {}
        output[key] = 1;
        let item = {image: DIRECTORY + '/' + imageName, output: output}
        images.push(item);
    }

    return images;
}

function encode(src) {
    return jimp.read(src)
        .then((image) => {
            image.resize(IMAGE_WIDTH, IMAGE_HEIGHT).quality(100).greyscale()

            let input = [];
            image.scan(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT, function (x, y, idx) {
                const red = this.bitmap.data[idx];
                const green = this.bitmap.data[idx + 1];
                const blue = this.bitmap.data[idx + 2];
                input.push(((red/255) + (green/255) + (blue/255)) / 3);
            })

            return input;
        })
}

async function write() {
    let images = buildImages();
    let data = [];
    let length = images.length;
    for (let i = 0; i < length; i++) {
        let item = images.pop();
        let inputs = await encode(item.image);
        data.push({input: inputs, output: item.output});
    }
    fs.writeFileSync(DIRECTORY + '/dataset.json', JSON.stringify(data));

    return data.length;
}

write().then((result) => {
    console.log("Data set with " + result + " pictures created.");
})

