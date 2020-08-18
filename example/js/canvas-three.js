'use strict';
//定义场景并初始化
var scene, width = 375, height = 667, fps = 30, speed = 5, autoRotate = false;
function initScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    //scene.fog = new THREE.Fog(0xffffff, 250, 1400);
}

//定义相机并初始化
var camera;
function initCamera() {
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1500);
    camera.position.set(0, 0, 200);//相机距离
    camera.lookAt(new THREE.Vector3(0, 0, 0));
}

//定义渲染器并初始化
var renderer, stats;
function initRenderer() {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    document.getElementById('container').appendChild(renderer.domElement);
    //renderer.setClearColor(0x000000, 1);
    //统计
    stats = new Stats();
    stats.setMode(0);
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    document.getElementById('container').appendChild(stats.domElement);
}

//定义灯光并初始化
function initLight() {
    var dlight = new THREE.DirectionalLight(0xffffff);
    var plight = new THREE.PointLight(0xffffff);
    plight.position.set(50, 15, 30);
    scene.add(dlight);
    scene.add(plight);

    // var dirLight = new THREE.DirectionalLight( 0xffffff, 0.125 );
    // dirLight.position.set( 0, 0, 1 ).normalize();
    // scene.add( dirLight );

    // var pointLight = new THREE.PointLight( 0xffffff, 1.5 );
    // pointLight.position.set( 0, 100, 90 );
    // scene.add( pointLight );
}


//添加3D文字
var textMesh;
function init3DText(fontloader) {
    var fontloader;
    fontloader = new THREE.FontLoader();
    fontloader.load('./fonts/helvetiker_regular.typeface.json', function (font) {
        var text = new THREE.TextGeometry('NEX', {//TextBufferGeometry
            font: font,
            size: 30,
            height: 12,
            bevelEnabled: true,//是否打开斜面. 默认值为False
            curveSegments: 1,//曲线上点的数量. 默认值为12
            bevelThickness: 1,//文本斜面的深度. 默认值为10.
            bevelSize: 1,//斜面离轮廓的距离. 默认值为8.
        });
        //text.computeBoundingBox();
        // 3D文字材质
        // MeshBasicMaterial：为几何体赋予一种简单的颜色，或者显示几何体的线框
        // MeshDepthMaterial：根据网格到相机的距离，该材质决定如何给网格染色
        // MeshNormalMaterial：根据物体表面的法向量计算颜色
        // MeshFaceMaterial：这是一种容器，可以在该容器中为物体的各个表面上设置不同的颜色
        // MeshLambertMaterial：考虑光照的影响，可以创建颜色暗淡，不光亮的物体
        // MeshPhongMaterial：考虑光照的影响，可以创建光亮的物体
        // ShaderMaterial：使用自定义的着色器程序，直接控制顶点的放置方式，以及像素的着色方式
        // LineBasicMaterial：可以用于THREE.Line几何体，从而创建着色的直线
        // LineDashedMaterial：类似与基础材质，但可以创建虚线效果
        var material = new THREE.MeshPhongMaterial({ //MeshPhongMaterial
            color: 0x8fc21f,
            specular: 0xF2FCC1, //highlight color
            shininess: 30,//brightness
            emissive: 0x3B5503,//light
            opacity: 1,
            transparent: false
        });
        textMesh = new THREE.Mesh(text, material);
        textMesh.position.x = -38;
        textMesh.position.y = 20;
        scene.add(textMesh);// 加入到场景中


        initEffects();
    });
}

function initEffects() {
    console.log('initEffects', textMesh.position, textMesh.rotation);
    var tween1 = new TWEEN.Tween({ rotax: textMesh.rotation.x, posy: textMesh.position.y - 80 });
    tween1.to({ rotax: 6, posy: textMesh.position.y }, 1200);
    tween1.easing(TWEEN.Easing.Quadratic.InOut);
    tween1.onUpdate(function (obj) {
        textMesh.position.y = obj.posy;
        textMesh.rotation.x = obj.rotax;// * 2 * Math.PI;
    });

    var tween = new TWEEN.Tween(textMesh.position);
    tween.to({ y: textMesh.position.y - 80 }, 1800);
    tween.delay(1000);
    tween.easing(TWEEN.Easing.Bounce.Out);
    //tween.repeat(10);
    //tween.repeatDelay(2000);
    tween.chain(tween1);
    tween.start();
}

var controls;
function initControl() {
    controls = new THREE.OrbitControls(camera);
    controls.addEventListener('change', render);
    controls.autoRotate = autoRotate;//自动旋转开关
    controls.autoRotateSpeed = speed;
}



function start() {
    initScene();
    initCamera();
    initRenderer();
    initLight();
    init3DText();
    initControl();
    animate();// 渲染
    //render();
}

var recorder, Frames = [], recording = false, recordTime = 0;
function animate() {
    stats.update();
    requestAnimationFrame(animate);
    //TWEEN.update();
    //controls.update();//自动旋转
    render();//不使用controls
    if (recording) {
        Frames.push(renderer.getContext().canvas.toDataURL("image/jpeg", 0.5));
    }

}
function render() {
    ////group.rotation.y += ( targetRotation - group.rotation.y ) * 0.05;
    ////camera.lookAt(cameraTarget);

    TWEEN.update();
    renderer.render(scene, camera);
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
    data.append('maxfps', 60);
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

