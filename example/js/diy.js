//(function () {
//   'use strict';
var width = 375, height = 667;
var count = 0, size = 50, canvas, ctx, stage, text, loader;
var shape, dashCmd, tween, image, groups = [];
function load() {
    canvas = document.getElementById("canvas");
    canvas.width = 375;
    canvas.height = 667;
    stage = new createjs.Stage(canvas,{});
    ctx = canvas.getContext('2d');
    image = new Image();
    image.crossOrigin = "Anonymous";
    image.src = "./logo.png";
    image.onload = function () {
        init();
    };
    setTimeout(function () {
        createjs.Tween.removeAllTweens();
        stage.clear();
        stage.removeAllChildren();
        init();
    }, 300);
}
function init() {
    text = new createjs.Text("NEXNOVO", '600 ' + size + "px Arial", "#777");
    var shadow = new createjs.Shadow("#79A500", 5, 5, 5);
    var width = text.getMeasuredWidth();

    stage.addChild(text);
    text.textAlign = "center";//default left|start|end|right|center
    text.textBaseline = "middle";//default top|hanging|middle|alphabetic|ideographic|bottom
    text.x = 182;//canvas.width / 2;
    text.y = 310;
    var colors1 = [{ color: '#F8B439', offset: 0 }, { color: '#ff0000', offset: 0.8 }, { color: '#EB629B', offset: 1 }];
    var colors2 = [{ color: '#FF8603', offset: 0 }, { color: '#9DF708', offset: 0.7 }, { color: '#0FFFFC', offset: 1 }];
    text.color = getColors(text.x / 2, text.y - size / 2, width, size, colors2);//green
    //ctx.fillStyle = '#fff';
    //ctx.fillRect(text.x / 2, text.y - size / 2, width, size);
    //text.shadow = shadow;
    text.regX = 0;//偏移
    text.regY = 0;//偏移
    //text.rotation = 15;
    text.scaleX = 1;
    text.scaleY = 1;
    text.skewX = 0;//斜切
    text.skewY = 0;//斜切
    text.outline = 2;//描边粗细
    //text.setBounds(-25, -125, 50, 50); ??
    //text.setTransform(50, 100, 2, 2)
    //text.transformMatrix = new createjs.Matrix2D(200, 100, 30, 1.5, 1);//(x, y, rotation, scale, skew)


    //加一个背景边
    shape = new createjs.Shape();
    shape.x = text.x;
    shape.y = text.y;
    shape.rotation = text.rotation;
    //shape.graphics.clear().beginFill("#eee").drawRect(-10 - width / 2, -10, width + 20, size + 20);
    //虚线
    dashCmd = shape.graphics.setStrokeDash([7, 3]).command;
    //shape.graphics.setStrokeStyle(4).beginStroke("green").rect(-10, -10, width + 20, size + 20);//画一个虚线边
    shape.graphics.setStrokeStyle(4).beginStroke("green").rect(-10 - width / 2, -size / 2 - 10, width + 20, size + 20);//画一个居中虚线边
    stage.addChildAt(shape, 0);

    //createjs.ColorPlugin.install();
    //动画(bounce运行一次反向,reversed反向运动)
    //backInOut加速带一掉反弹|加速cubicInOut|干脆quartInOut-quadInOut-quintInOut|物理反弹bounceInOut|前后反弹elasticInOut|中间快circInOut|出场慢sineInOut
    var tweenGroup = new createjs.TweenGroup();
    tweenGroup.get(text, { loop: true, bounce: false })
        //tween = createjs.Tween.get(text, { loop: 0, bounce: false })
        //.to({ x: canvas.width - 100, rotation: 360 }, 2500, createjs.Ease.bounceOut).wait(1000)
        //掉下
        //.to({ x: text.x, y: canvas.height - 36, rotation: -360 }, 2200, createjs.Ease.bounceOut).wait(1000) 
        //.to({ x: text.x - 500, y: canvas.height - 300, scaleX: 9, scaleY: 9 }, 5000, createjs.Ease.quadOut).wait(1000) //放大
        //.to({ x: 200, y: 200, rotation: 15, scaleX: 1, scaleY: 1 }, 2500, createjs.Ease.quintInOut).wait(1000)//缩小
        //水平转圈
        //.to({ scaleX: -1, scaleY: 1 }, 2000, createjs.Ease.sineInOut)
        //.to({ scaleX: 1, scaleY: 1 }, 2000, createjs.Ease.sineInOut)
        //转一圈
        //.to({skewX:0,skewY:180,scale:5, rotation: 180}, 2000, createjs.Ease.sineInOut)
        //.to({skewX:0,skewY:360,scale:1, rotation: 360}, 2000, createjs.Ease.sineInOut)
        //旋转放大(需要loop:true,bounce:true)
        //.to({scale:2, rotation: 360}, 2000, createjs.Ease.sineInOut).wait(10)
        //旋转放大再缩小
        //.to({scale:5, rotation: 180}, 1500, createjs.Ease.quadInOut)
        //.to({scale:1, rotation: 360}, 1500, createjs.Ease.quadInOut)
        //左右旋转的放大缩小(需要loop:true,bounce:true) //sineInOut
        .to({ rotation: 20, scaleX: 1.5, scaleY: 1.5 }, 1000, createjs.Ease.sineInOut)
        .to({ rotation: 0, scaleX: 1, scaleY: 1 }, 1000, createjs.Ease.sineInOut)
        .to({ rotation: -20, scaleX: 1.5, scaleY: 1.5 }, 1000, createjs.Ease.sineInOut)
        .to({ rotation: 0, scaleX: 1, scaleY: 1 }, 1000, createjs.Ease.sineInOut)
        //颜色
        //.to({ color: '#ff0000' }, 1000, createjs.Ease.sineInOut)
        .call(complete);


    createjs.Ticker.framerate = 25;//帧率
    //createjs.Ticker.timingMode = createjs.Ticker.RAF;//使用RAF会忽略帧率
    createjs.Ticker.addEventListener("tick", tick);//stage
    //stage.update();
    //tween.duration = 2000;//执行时间(时间到后不会再有动画)
    //tween.timeScale = 0.3;//时间线


    //sprite
    var spriteSheet = new createjs.SpriteSheet({
        framerate: 30,
        //images: ['sprite-text.png'],//"./logo.png"
        //frames: { count: 140, height: 256, width: 256 },
        images: ['./image/sprite-image.png'],
        frames: { count: 31, width: 234, height: 256 },
    });
    spriteSheet.on("complete", function (event) {
        console.log("Complete", event);
    });
    spriteSheet.on("error", function (event) {
        console.log("Error", event);
    });
    var sprite = new createjs.Sprite(spriteSheet);
    sprite.x = 130;
    sprite.y = 10;
    stage.addChild(sprite);
    //sprite.play();





    //texts
    var texts = 'Hello';
    var totalWidth = 0,textWidth=0;
    for (var i = 0; i < texts.length; i++) {
        totalWidth += textWidth;
        groups[i] = new createjs.Text(texts[i], '700 50px Arial', "#fff");
        textWidth = groups[i].getMeasuredWidth();
        groups[i].x = (50 + textWidth/2) + totalWidth;
        groups[i].y = 130;
        //groups[i].color = getColors(groups[i].x / 2, groups[i].y - size / 2, width, size, colors1);;
        stage.addChild(groups[i]);
        tweenGroup.get(groups[i], { loop: 0, bounce: false })
            //.wait(200*i).to({ x: groups[i].x -100 }, 1500,createjs.Ease.bounceOut)
            .wait(1200).wait(200 * i).to({ y: 600, skewX: 15 }, 1500, createjs.Ease.bounceOut).wait(1500).to({ y: 130, rotation: 360, skewX: 0 }, 1500, createjs.Ease.quartInOut)
        //.to({ scale: 8, x: 380, y: -50 }, 0, createjs.Ease.quartInOut).wait(200 * i).to({ scale: 1, x: groups[i].x, y: 250 }, 1500, createjs.Ease.quartInOut)
    }

}










var recorder, Frames = [], recording = false, recordTime = 0;
function tick(event) {
    count++;
    //var r = Math.floor(Math.random() * 256);
    //var g = Math.floor(Math.random() * 256);
    //var b = Math.floor(Math.random() * 256);
    //text.color= '#'+r.toString(16)+g.toString(16)+b.toString(16);
    //text.skewX++;
    //text.skewY--;
    //text.rotation++;shape.rotation++;
    //text.text = "NEXNOVO " + count; //更新文字
    dashCmd.offset++; //更新虚线
    //shape.graphics.clear().beginFill("#eee").drawRect(-10, -10, text.getMeasuredWidth() + 20, size + 20);//更新背景大小
    stage.update(event);
    //获取blob
    if (recording) {
        Frames.push(canvas.toDataURL("image/jpeg", 0.5));
        // canvas.toBlob((blob) => {
        //     Frames.push(blob);
        // }, 'image/jpeg', 0.5);
    }
}
function complete() {
    console.log('Tween complete');
}

function getColors(x, y, xw, xh, colors) {
    var width = text.getMeasuredWidth();
    var gradient = ctx.createLinearGradient(x, y, xw, xh);
    for (var i = 0; i < colors.length; i++) {
        gradient.addColorStop(colors[i].offset, colors[i].color);
    }
    return gradient;
}
function renderPreview(imageEl, x, y) {
    var image = new createjs.Bitmap(imageEl);
    image.x = x;
    image.y = y;
    image.scaleX = 375 / imageEl.width;
    image.scaleY = 667 / imageEl.height;
    stage.addChild(image);
    stage.update();
}
function renderText(str, x, y, size) {
    var text = new createjs.Text(str, '600 ' + size + "px Arial", "#777");
    text.x = x;
    text.y = y;
    stage.addChild(text);
    stage.update();
}
function renderSprite(image, x, y) {
    var spriteSheet = new createjs.SpriteSheet({
        framerate: 30,
        //images: ['sprite-text.png'],//"./logo.png"
        //frames: { count: 140, height: 256, width: 256 },
        images: [image ? image : './image/sprite-image.png'],
        frames: { count: 31, width: 234, height: 256 },
    });
    spriteSheet.on("complete", function (event) {
        console.log("Complete", event);
    });
    spriteSheet.on("error", function (event) {
        console.log("Error", event);
    });
    var sprite = new createjs.Sprite(spriteSheet);
    sprite.x = -1;
    sprite.y = -4;
    stage.addChild(sprite);
    sprite.play();
}





function startRecord(time) {
    //方法1: MediaRecorder录制webm iOS和safari都不支持
    //https://developer.mozilla.org/zh-CN/docs/Web/API/MediaRecorder
    // var allChunks = []; 
    // var stream = canvas.captureStream(30);
    // recorder = new MediaRecorder(stream, {
    //     mimeType: 'video/webm; codecs=opus',
    //     videoBitsPerSecond: 512000
    // });
    // recorder.ondataavailable = (e) => {
    //     allChunks.push(e.data);
    // }
    // recorder.start(10);
    // recorder.onstop = () => {
    //     var allBlob = new Blob(allChunks);
    //     console.log('recorder onstop!' + allChunks.length);
    //     downloadBlob(allBlob);
    // }
    //方法2:配合node后端录制
    Frames = [];
    recording = true;
    recordTime = Date.now();
    document.querySelector('#info').innerHTML = '正在录制...';
    setTimeout(() => {
        stopRecord();
    }, time);
}
function stopRecord() {
    //方法1:MediaRecorder方式录制后可以下载webm文件
    //recorder && recorder.stop();
    // if (Frames && Frames.length) {
    //     var allBlob = new Blob(Frames, { type: "image/jpeg" });
    //     console.log(Frames.length, allBlob);
    //     downloadBlob(allBlob);
    // }

    //方法2:把帧数据传到后台处理
    if (!recording) return;
    recording = false;
    var info = document.querySelector('#info');
    var video = document.querySelector('#video');
    info.innerHTML = '正在处理...';
    var data = new FormData();
    data.append("videoData", new Blob([Frames.join('　')], { type: "text/plain" }));
    data.append('duration', (Date.now() - recordTime) / 1000);
    data.append('size', '375x667');  // canvas.width + 'x' + canvas.height
    var xhr = new XMLHttpRequest();
    xhr.addEventListener('load', e => {
        console.log(e.target.responseText, e.target);
        if (e.target.status == 200) {
            info.innerHTML = 'fps:' + (1000 / (6000 / Frames.length)).toFixed(2) + '/Frames:' + Frames.length;
            var res = JSON.parse(e.target.responseText);
            if (res && res.code == 1) {
                video.src = res.url;
                video.play();
            }
        }
    }, false);
    xhr.addEventListener("error", function (e) {
        console.log('error', e);
    }, false);
    xhr.open('POST', '/recorder', true);
    xhr.send(data);
}
function downloadBlob(blobObj) {
    var link = document.createElement('a');
    link.style.display = 'none';
    link.href = window.URL.createObjectURL(blobObj);
    link.download = `test.webm`;
    document.body.appendChild(link);
    link.click();
    link.remove();
}
//})();