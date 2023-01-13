const jimp = require('jimp');
const fs = require('fs');

// function getImageInput(src, w, h) {
//     let input = [];
//     return jimp.read(src)
//         .then((image) => {
//             image
//                 .resize(w, h)
//                 .quality(100)
//                 .greyscale()
//             // .write('img/lena-small-bw.jpg');
//             image.scan(0, 0, 128, 128, function (x, y, idx) {
//                 const red = this.bitmap.data[idx];
//                 const green = this.bitmap.data[idx + 1];
//                 const blue = this.bitmap.data[idx + 2];
//                 input.push(((red/255) + (green/255) + (blue/255)) / 3);
//             })
//
//             return input;
//         })
// }
//
// let data = [];
// let images = [
//     {image: 'img/tools/hammer1.png', output: {hammer: 1}},
//     // {image: 'img/tools/hammer2.png', output: {hammer: 1}},
//     // {image: 'img/tools/hammer3.png', output: {hammer: 1}},
//     {image: 'img/tools/sward.png', output: {sword: 1}},
//     // {image: 'img/tools/sward2.png', output: {sword: 1}},
//     // {image: 'img/tools/sward3.png', output: {sword: 1}},
//     // {image: 'img/tools/hammer_test.png', output: {hammer: 1}},
//     // {image: 'img/tools/sward_test.png', output: {sword: 1}}
//     // {image: 'img/test/hammer.png', output: {hammer: 1}}
// ];
//
// async function get() {
//     let length = images.length;
//     for (let i = 0; i < length; i++) {
//         let item = images.pop();
//         let inputs = await getImageInput(item.image, 128, 128);
//         data.push({input: inputs, output: item.output});
//     }
//
//     fs.writeFileSync('img/dataset_2_item.json', JSON.stringify(data));
//
//     return data;
// }
//
// get()

async function convert(src, w, h) {
    let input = [];
    return jimp.read(src)
        .then((image) => {
            image
                .resize(w, h)
                .quality(100)
                .greyscale()
            image.scan(0, 0, w, h, function (x, y, idx) {
                const red = this.bitmap.data[idx];
                const green = this.bitmap.data[idx + 1];
                const blue = this.bitmap.data[idx + 2];
                input.push(((red/255) + (green/255) + (blue/255)) / 3);
            })

            return input;
        })
}

module.exports = {convert};