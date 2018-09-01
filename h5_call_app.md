前一段时间在做电流App H5页面，需求中落地页占比较大，落地页承担的职责就是引流。引流有两种形式，同时也是我们对唤端的定义：引导已下载用户打开APP，引导未下载用户下载APP。

引导已下载用户打开APP，从数据上说用户停留在APP中的时间更多了，是在提高用户粘性；从体验上说，APP体验是要比H5好的。引导未下载用户下载APP，可以增加我们的用户量。

上面其实分别解释了 **什么是唤端** 以及 **为什么要唤端**，也就是  *3W法则* 中的 What 和 Why，那么接下来我们就要聊一聊 How 了，也就是 **如何唤端** 。

我们先来看看常见的唤端方式以及他们适用的场景：

## 唤端媒介

### URL Scheme

#### 来源

我们的手机上有许多私密信息，联系方式、照片、银行卡信息...我们不希望这些信息可以被手机应用随意获取到，信息泄露的危害甚大。所以，如何保证个人信息在设备所有者知情并允许的情况下被使用，是智能设备的核心安全问题。

对此，苹果使用了名为 *沙盒* 的机制：应用只能访问它声明可能访问的资源。但沙盒也阻碍了应用间合理的信息共享，某种程度上限制了应用的能力。

因此，我们急需要一个辅助工具来帮助我们实现应用通信， URL Scheme 就是这个工具。

#### URL Scheme 是什么

我们来看一下 URL 的组成：

```
[scheme:][//authority][path][?query][#fragment]
```

我们拿 `https://www.baidu.com` 来举例，scheme 自然就是 `https` 了。

就像给服务器资源分配一个 URL，以便我们去访问它一样，我们同样也可以给手机APP分配一个特殊格式的 URL，用来访问这个APP或者这个APP中的某个功能(来实现通信)。APP得有一个标识，好让我们可以定位到它，它就是 URL 的 Scheme 部分。

#### 常用APP的 URL Scheme

| APP        | 微信       | 支付宝     | 淘宝       | 微博         | QQ     | 知乎      | 短信   |
| :-------: | :--------: | :-------: | :-------: | :----------: | :----: | :------: | :----: |
| URL Scheme | weixin:// | alipay:// | taobao:// | sinaweibo:// | mqq:// | zhihu:// | sms:// |

#### URL Scheme 语法

上面表格中都是最简单的用于打开 APP 的 URL Scheme，下面才是我们常用的 URL Scheme 格式：

```
     行为(应用的某个功能)    
            |
scheme://[path][?query]
   |               |
应用标识       功能需要的参数
```

### Intent

安卓的原生谷歌浏览器自从 chrome25 版本开始对于唤端功能做了一些变化，URL Scheme 无法再启动Android应用。 例如，通过 iframe 指向 `weixin://`，即使用户安装了微信也无法打开。所以，APP需要实现谷歌官方提供的 `intent:` 语法，或者实现让用户通过自定义手势来打开APP，当然这就是题外话了。

#### Intent 语法

```
intent:
   HOST/URI-path // Optional host 
   #Intent; 
      package=[string]; 
      action=[string]; 
      category=[string]; 
      component=[string]; 
      scheme=[string]; 
   end;
```

如果用户未安装 APP，则会跳转到系统默认商店。当然，如果你想要指定一个唤起失败的跳转地址，添加下面的字符串在 `end;` 前就可以了:

```
S.browser_fallback_url=[encoded_full_url]
```

#### 示例

下面是打开 Zxing 二维码扫描 APP 的 intent。

```
intent:
   //scan/
   #Intent; 
      package=com.google.zxing.client.android; 
      scheme=zxing; 
   end; 
```

打开这个 APP ，可以通过如下的方式：

``` html
 <a href="intent://scan/#Intent;scheme=zxing;package=com.google.zxing.client.android;S.browser_fallback_url=http%3A%2F%2Fzxing.org;end"> Take a QR code </a>
```

### Universal Link

#### Universal Link 是什么

Universal Link 是苹果在 WWDC2015 上为 iOS9 引入的新功能，通过传统的 HTTP 链接即可打开 APP。如果用户未安装 APP，则会跳转到该链接所对应的页面。

#### 为什么要使用 Universal Link

传统的 Scheme 链接有以下几个痛点：

+ 在 ios 上会有确认弹窗提示用户是否打开，对于用户来说唤端，多出了一步操作。若用户未安装 APP ，也会有一个提示窗，告知我们 “打不开该网页，因为网址无效”
+ 传统 Scheme 跳转无法得知唤端是否成功，Universal Link 唤端失败可以直接打开此链接对应的页面
+ Scheme 在微信、微博、QQ浏览器、手百中都已经被禁止使用，使用 Universal Link 可以避开它们的屏蔽（ 截止到 18年8月21日，微信和QQ浏览器已经禁止了 Universal Link，其他主流APP未发现有禁止 ）

#### 如何让 APP 支持 Universal Link

有大量的文章会详细的告诉我们如何配置，你也可以去看[官方文档](https://developer.apple.com/library/archive/documentation/General/Conceptual/AppSearch/UniversalLinks.html#//apple_ref/doc/uid/TP40016308-CH12-SW2)，我这里简单的写一个12345。

1. 拥有一个支持 **https** 的域名
2. 在 [开发者中心](https://developer.apple.com/) ，Identifiers 下 AppIDs 找到自己的 App ID，编辑打开 Associated Domains 服务。
3. 打开工程配置中的 Associated Domains ，在其中的 Domains 中填入你想支持的域名，必须以 `applinks:` 为前缀
4. 配置 `apple-app-site-association` 文件，文件名必须为 `apple-app-site-association` ，**不带任何后缀**
5. 上传该文件到你的 HTTPS 服务器的 **根目录** 或者 `.well-known` 目录下

#### Universal Link 配置中的坑

这里放一下我们在配置过程中遇到的坑，当然首先你在配置过程中必须得严格按照上面的要求去做，尤其是加粗的地方。

1. 域名问题

	Universal Link 支持的域名最多只能支持到二级域名，如果你用到了三级域名，Universal Link 唤端是不会生效的。

2. 跨域问题

	IOS 9.2 以后，必须要触发跨域才能支持 Universal Link 唤端。

	IOS 那边有这样一个判断，如果你要打开的 Universal Link 和 当前页面是同一域名，ios 尊重用户最可能的意图，直接打开链接所对应的页面。如果不在同一域名下，则在你的 APP 中打开链接，也就是执行具体的唤端操作。

3. Universal Link 是空页面

	Universal Link 本质上是个空页面，如果未安装 APP，Universal Link 被当做普通的页面链接，自然会跳到 404 页面，所以我们需要将它绑定到我们的中转页或者下载页。

## 如何调用三种唤端媒介

通过前面的介绍，我们可以发现，无论是 URL Scheme 还是 Intent 或者 Universal Link ，他们都算是 URL ，只是 URL Scheme 和 Intent 算是特殊的 URL。所以我们可以拿使用 URL 的方法来使用它们。

### iframe 

``` html
<iframe src="sinaweibo://qrcode">
```

在只有 URL Scheme 的日子里，iframe 是使用最多的了。因为在未安装 app 的情况下，不会去跳转错误页面。但是 iframe 在各个系统以及各个应用中的兼容问题还是挺多的，不能全部使用 URL Scheme。 

### a 标签

``` html
<a href="intent://scan/#Intent;scheme=zxing;package=com.google.zxing.client.android;end"">扫一扫</a>
```

前面我们提到 Intent 协议，官方给出的用例使用的就是使用的 a 标签，所以我们跟着一起用就可以了。

### window.location

``` js
window.location.href = 'sinaweibo://qrcode';

```

URL Scheme 在 ios 9+ 上诸如 safari、UC、QQ浏览器中， iframe 均无法成功唤起 APP，只能通过 window.location 才能成功唤端。

当然，如果我们的 app 支持 Universal Link，ios 9+ 就用不到 URL Scheme 了。而 Universal Link 在使用过程中，我发现在 qq 中，无论是 iframe 导航 还是 a 标签打开 又或者 window.location 都无法成功唤端，一开始我以为是 qq 和微信一样禁止了 Universal Link 唤端的功能，其实不然，百般试验下，通过 top.location 唤端成功了。

## 判断唤端是否成功

如果唤端失败（APP 未安装），我们总是要做一些处理的，可以是跳转下载页，可以是 ios 下跳转 App Store... 但是Js 并不能提供给我们获取 APP 唤起状态的能力，Android Intent 以及 Universal Link 倒是不用担心，它们俩的自身机制允许它们唤端失败后直接导航至相应的页面，但是 URL Scheme 并不具备这样的能力，所以我们只能通过一些很 hack 的方式来实现 APP 唤起检测功能。

``` js
const initialTime = new Date();
let counter = 0;
let waitTime = 0;

const checkOpen = setInterval(() => {
   count++;
   waitTime = new Date() - initialTime;

   if (waitTime > 2500) {
      clearInterval(checkOpen);
      cb();
   }

   if (counter < 100) return;

   const hide = document.hidden || document.webkitHidden;

   if (!hide) {
      cb(); // 唤端失败的回调函数
   }
}, 20);
```

APP 如果被唤起的话，页面就会进入后台运行，setInterval 在 ios 中不会停止运行，在 android 中停止运行。

每 20ms 执行一次，执行 100次 在页面中实际耗费与 2000 ms 不会相差多少。

我们的判断条件比预期时间多设置了 500ms，所以如果安卓中 setInterval 内的函数执行 100 次以内所费时间超过 2500ms，则说明 APP 唤起成功，反之则代表失败。

我们通过 document.hidden 和 document.webkitHidden 属性来判断 APP 在 ios 中是否被正常唤起，2000ms 内，页面转入后台运行，document.hidden 会返回 true，代表唤端成功，反之则代表失败。

## 没有完美的方案

透过上面的几个点，我们可以发现，无论是 *唤端媒介* 、 *调用唤端媒介* 还是 *判断唤端结果* 都没有一个十全十美的方法，我们在代码层上能做的只是在确保最常用的场景（比如 微信、微博、UC 等）唤端无误的情况下，最大化的兼容剩余的场景。

好的，我们接下来扯一些代码以外的，让我们的 APP 能够在更多的平台唤起。

+ 微信、微博、手百、QQ浏览器等。

	这些应用能阻止唤端是因为它们直接屏蔽掉了 URL Scheme 。接下来可能就有看官疑惑了，微信中是可以打开大众点评的呀，微博里面可以打开优酷呀，那是如何实现的呢？

	它们都各自维护着一个白名单，如果你的域名在白名单内，那这个域名下所有的页面发起的 URL Scheme 就都会被允许。就像微信，如果你是腾讯的“家属”，你就可以加入白名单了，微信的白名单一般只包含着“家属”，除此外很难申请到白名单资质。但是微博之类的都是可以联系他们的渠道童鞋进行申请的，只是条件各不相同，比如微博的就是在你的 APP 中添加打开微博的入口，三个月内唤起超过 100w 次，就可以加入白名单了。

+ 腾讯应用宝直接打开 APP 的某个功能

	刚刚我们说到，如果你不是微信的家属，那你是很难进入白名单的，所以在安卓中我们一般都是直接打开腾讯应用宝，ios 中 直接打开 App Store。点击腾讯应用宝中的“打开”按钮，可以直接唤起我们的 APP，但是无法打开 APP 中的某个功能（就是无法打开指定页面）。

	腾讯应用宝对外开放了一个叫做 APP Link 的申请，只要你申请了 APP Link，就可以通过在打开应用宝的时候在应用宝地址后面添加上 `&android_schema={your_scheme}` ，来打开指定的页面了。

## 开箱即用的callapp-lib

信息量很大！各种问题得自己趟坑验证！内心很崩溃！

不用愁，已经为你准备好了药方，只需照方抓药即可😏 —— npm 包 [callapp-lib](https://www.npmjs.com/package/callapp-lib)

它能在大部分的环境中成功唤端，而且炒鸡简单啊，拿过去就可以用啊，还支持很多扩展功能啊，快来瞅瞅它的 [文档](https://github.com/suanmei/callapp-lib) 啊~~~

## 参考文章

1. [关于通过H5页面唤起Native客户端的介绍](https://futu.im/posts/h5-callup-native/)
2. [浏览器中唤起 native app，否则跳转到应用商城下载](http://web.jobbole.com/86706/)
3. [h5唤起app](http://echozq.github.io/echo-blog/2015/11/13/callapp.html)
4. [URL Schemes 使用详解](https://sspai.com/post/31500)
5. [Android Intents with Chrome](https://developer.chrome.com/multidevice/android/intents)
6. [常用URL Scheme](https://blog.csdn.net/xttxqjfg/article/details/76019824)
7. [Universal Link 前端部署采坑记](http://www.cocoachina.com/ios/20170904/20463.html)
8. [Support Universal Links](https://developer.apple.com/library/archive/documentation/General/Conceptual/AppSearch/UniversalLinks.html#//apple_ref/doc/uid/TP40016308-CH12-SW2)
9. [Universal Link是个骗子](https://yq.aliyun.com/articles/608583)
