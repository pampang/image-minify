# image-minify
Use gulp and imagemin to minify assigned folder recursively.

## 使用

压缩图片：
`gulp minify-images --images-src="../mall/"`

统计图片压缩比：

`npm run test --images-src="../mall/"`

处理完毕之后，temp/ 是指定图片来源文件夹里的所有图片，temp-dest/ 是压缩后的图片。

## 注意

本项目针对 react-native，筛掉 android/、ios/、node_modules/ 文件夹中的所有图片。
