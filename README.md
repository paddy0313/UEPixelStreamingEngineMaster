# UEPixelStreamingEngineMaster
UE Pixel Streaming Engine Master
虚幻引擎像素流模式 渲染主机端管理程序

## 程序下载地址
- [点击下载](https://ue-pixel-streaming-engine.oss-cn-hangzhou.aliyuncs.com/UEPixelStreamingEngineMaster.exe)

## 信令服务
#### 开源地址
- xxxxx


## JSSDK
#### 开源地址
- https://github.com/laperlee003/UEPixelStreamingEngineJSSDK

## 该程序是基于electron开发的PC端程序
目前支持平台为Windows

该程序包含独立的信令服务程序(启动界面选择本地信令服务即可启动本地信令服务)


## 虚幻引擎包植入说明
将虚幻引擎打包以后(带上像素流插件进行打包)如图

![image](https://user-images.githubusercontent.com/15978397/174209865-f2ba0258-7c3f-4f71-92c8-128627908e23.png)

将包根目录下所有文件复制到UEPixelStreamingEngineMaster程序根目录下的render目录内

并创建config.json文件

该文件内容为
```
{
  "exefile":"/SmartEarth/Binaries/Win64/SmartEarth.exe",
  "param":["-RenderOffScreen"]
}
```
exefile 为ue4运行程序相对render目录所在位置

param 为启动的附带参数"-RenderOffScreen"未后台运行 具体参考虚幻引擎官方文档


## 程序界面介绍
### 登录界面介绍
#### 远程信令服务模式
![image](https://user-images.githubusercontent.com/15978397/174204722-015a3229-4d0d-404c-b354-9c4bc94616fb.png)

启动以后默认是连接远程信令服务地址和端口

#### 本地信令服务模式
当勾选本地信令服务的时候界面会变成

![image](https://user-images.githubusercontent.com/15978397/174548395-a22814d0-a6b4-4ec8-bf76-c2d9dd396d9d.png)

服务端口: 信令服务提供的端口号

管理员账号:后台管理登录账号

管理员密码:后台管理登录密码

### 登录后界面
点击接入按钮进入登录后界面
![image](https://user-images.githubusercontent.com/15978397/174206003-abc424e3-f538-472c-b892-a83b14c4eadb.png)

顶部渲染平台管理端 边上的圆点亮起来表示ue4管理模块已经连上信令服务 否则表示未建立连接

右侧的3个按钮分别是开机自启 退出登录 关闭客户端(关闭可选取消、关闭、最小化到托盘)

界面剩余空间为程序的日志区域,包括连接信令服务、启动关闭虚幻引擎包等日志信息

### 后台管理界面
![image](https://user-images.githubusercontent.com/15978397/174212423-59caa5ab-6ab7-4396-986b-fd2e1e95a1d1.png)

输入管理员账号密码

点击登录进入管理界面

![image](https://user-images.githubusercontent.com/15978397/174212490-19fc7b11-26aa-4fcb-a02d-704d5b102308.png)

点击查看案例即可进入像素流体验模式

该体验页面由开源的JSSDK接入 如图

![image](https://user-images.githubusercontent.com/15978397/175313939-37f034a3-fb83-473b-b2c4-3e99fb4a31e5.png)

