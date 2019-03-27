# 压缩虾 #

**批量压缩扫描的PDF文件，一个用来运行GhostScript的Electron GUI**

[English Ver.](README_CN.md)

![logo](assets/img/shrimp.png)

## 下载 ##

**当前版本： 0.1.0**

* [Windows 64位](https://github.com/bclicn/shrink-shrimp/releases/download/0.1.0/shrink_shrimp-0.1.0-win32-x64.rar)
* [OSX](https://github.com/bclicn/shrink-shrimp/releases/download/0.1.0/shrink_shrimp-0.1.0-darwin.zip)
* [Linux 64位](https://github.com/bclicn/shrink-shrimp/releases/download/0.1.0/shrink_shrimp-0.1.0-linux-x64.tar.gz)

或访问[发布页面](https://github.com/bclicn/shrink-shrimp/releases)直接下载

## 使用 ##

1. 将一个或多个PDF文件__拖拽到虾米__
2. 等待压缩完成
3. 压缩后的PDF文件与源文件在相同文件夹下，并有__shrink__前缀
4. 压缩后点击右下角的虾米图标重置页面
5. 如果遇到错误，将鼠标挪到记录上查看错误信息

__注意:__  要在__OSX__或__Ubuntu__上使用，你需要预先安装 `GhostScript`。__Windows__ 版本已经包括`GhostScript`，无需另行安装

* __OSX:__ `brew install ghostscript`
* __Ubuntu:__ `sudo apt-get install ghostscript` (你可能需要设置镜像，请自行百度)

## 开发 ##

假设你已经安装了 `nodejs 10+` 和 `npm`

    cd /to/some/dir/
    git clone https://github.com/bclicn/shrink-shrimp.git

    // 中国用户下载electron会很慢，建议先添加淘宝npm源
    npm install -g mirror-config-china --registry=http://registry.npm.taobao.org

    npm install
    npm start

## 编译 ##

首先执行__开发__中的步骤，然后

    // 在 Windows 64位 上
    npm run build-win
    // 在 OSX 上
    npm run build-mac
    // 在 Linux 上
    npm run build-linux 

__注意:__在__Windows__上编译完成后，下载[gs-926-win32-x64.zip](https://github.com/bclicn/shrink-shrimp/releases/download/0.1.0/gs-926-win32-x64.zip), 并将 `gsdll64.dll`和`gs.exe`拷贝到`shrink_shrimp.exe`所在的文件夹下, 这样你的用户就无需预先安装`GhostScript`了

## 错误报告 ##

请使用[错误报告页面](https://github.com/bclicn/shrink-shrimp/issues),
此外，请在提交错误报告时包括尽量详细的信息 (__鼠标挪到错误记录上能看到！__)

## 证书 ##
[MIT](LICENSE)



