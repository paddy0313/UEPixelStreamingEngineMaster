# UEPixelStreamingEngineMaster
UE Pixel Streaming Engine Master
虚幻引擎像素流模式 渲染主机端管理程序

## 程序下载地址
- [点击下载](https://ue-pixel-streaming-engine.oss-cn-hangzhou.aliyuncs.com/UEPixelStreamingEngineMasterV1.0.0.exe)

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
并插件config.json文件
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

![image](https://user-images.githubusercontent.com/15978397/174205965-f5002287-2194-4ef5-a051-45e4dbf53f81.png)


拉流端端口: 网页端连接信令服务的端口
推流端端口: 虚幻引擎程序连接的信令服务端口
主机管理端端口:程序内的ue4程序管理模块连接的信令服务端口
管理端端口:程序内嵌了一个后台管理web服务,该端口是提供后台管理访问端口
管理端接口端口:程序内嵌了一个后台管理web服务,该端口是提供后台管理接口访问端口
管理员账号:后台管理登录账号
管理员密码:后台管理登录密码

### 登录后界面
点击接入按钮进入登录后界面
![image](https://user-images.githubusercontent.com/15978397/174206003-abc424e3-f538-472c-b892-a83b14c4eadb.png)
顶部渲染平台管理端 边上的圆点亮起来表示ue4管理模块已经连上信令服务 否则表示未建立连接
右侧的3个按钮分别是开机自启 退出登录 关闭客户端(关闭可选取消、关闭、最小化到托盘)
界面剩余空间为程序的日志区域,包括连接信令服务、启动关闭虚幻引擎包等日志信息
