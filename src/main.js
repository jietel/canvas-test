
const express = require('express');
const http = require('http');
const fs = require("fs");
const app = express();
const webPath = __dirname + '/../example';
//npm install body-parser --save
const bodyParser = require('body-parser');
app.use(express.static(webPath/*__dirname*/));
app.use(bodyParser.urlencoded({ extended: true }));
const server = http.createServer(app);

//npm install multer --save
const multer = require('multer');//用于读取上传的FormData
const uploadPath = webPath + '/upload/';
const upload = multer({ dest: uploadPath });
//npm install fluent-ffmpeg --save
const ffmpeg = require('fluent-ffmpeg');



server.listen(8107, function listening() {
    let host = server.address().address;
    let port = server.address().port;
    console.log("start server ==> http://%s:%s\n", host, port);

});

app.get('/hello', (req, res) => {
    console.log(req.baseUrl, req.originalUrl, req.query);
    res.send("Hello canvas-record");
});

app.post('/recorder', upload.single('videoData'), (req, res) => {
    console.log('\nRequest:' + req.method, req.body);
    var filename = req.file.filename;
    var buffer = fs.readFileSync(uploadPath + filename);
    var images = String(buffer).split('　');
    var maxfps = req.body.maxfps || 25;
    fs.mkdirSync(uploadPath + filename + '-temp/');
    Promise.all(images.map((img, idx) => {
        var imgData = decodeBase64Image(img);
        return new Promise(function (resolve, reject) {
            var imgName = uploadPath + filename + '-temp/' + idx + '.jpeg';
            fs.writeFile(imgName, imgData.data, 'base64', (err) => {
                //console.log(imgName + ' writeFile:' + err);
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            });
        });
    })).then(() => {
        let duration = req.body.duration ? req.body.duration : 0;
        let inputFps = duration ? 1000 / (duration * 1000 / images.length) : 25;
        let outputFps = inputFps >= maxfps ? maxfps : inputFps;
        let size = req.body.size && (req.body.size).indexOf('x') > 0 ? req.body.size : '384x512';
        console.log('Saved frames:' + images.length, 'duration:' + duration, 'inputFps:' + inputFps, 'outputFps:' + outputFps, 'size:' + size);
        var proc = new ffmpeg({ source: uploadPath + filename + '-temp/%d.jpeg', nolog: true })
            .inputFps(inputFps) //录制时实际帧率
            .outputFps(outputFps)  //导出帧率
            .duration(duration)  //最大时间限制
            .withSize(size)
            .on('end', function (err,stdout,stderr) {
                //console.log('--------------',stdout);
                deleteTemp(images, filename);
                res.json({ code: 1, url: '/upload/' + filename + '.mp4' });
            })
            .on('error', function (err) {
                console.log('FFmpeg error: ', err.message);
                deleteTemp(images, filename);
                res.json({ code: 0, msg: err.message });
            })
            .saveToFile(uploadPath + filename + '.mp4')
    }).catch(err => {
        console.log('Saved error: ', err);
        deleteTemp(images, filename);
        res.json({ code: 0, msg: err });
    });

});


function deleteTemp(images, filename) {
    images.forEach((img, idx) => {
        fs.unlinkSync(uploadPath + filename + '-temp/' + idx + '.jpeg');
    });
    fs.rmdirSync(uploadPath + filename + '-temp');
    fs.unlinkSync(uploadPath + filename);
}

function decodeBase64Image(dataString) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
        response = {};
    if (matches.length !== 3) {
        return new Error('Invalid input string');
    }
    response.type = matches[1];
    response.data = Buffer.from(matches[2], 'base64');
    return response;
}

