
# canvas-record

* 该项目采用createjs作为canvas框架
* 支持特色文字特效
* 支持图片sprite雪碧图
* 支持动画播放
* 支持录制帧率上传给node处理
* 支持帧率合称为mp4

##注意事项
* 生成的命令
```
ffmpeg -loop 1 -f image2 -i F:\...-temp\%d.jpeg -vcodec h264 -t 6.017 -s 376x668 -r 24.430779458201762 F:\...\upload\1.mp4
```
* 要确保按照传入的duration生成视频时长注意-loop 和 -t同时设置
> 做输入选项（在-i之前），是限制读取输入文件的的时长； 
用做输出选项（before an output url），超过这个时间停止写输出文件； 
比如：循环读取一个输入文件时（-loop 1），当到时间就会停止输出，生成一个duration时长的视频。但是如果没有循环选项，而且输入文件短于这个时长时，就会随着输入文件结束就结束，生成视频，视频时长小于duration。所以我们可以看出 -t 并不仅仅是输出文件时长。


## 安装
*npm install body-parser --save
*npm install multer --save
*npm install fluent-ffmpeg --save

*或者直接npm install

*下载对应平台的ffmpeg即可运行测试。
