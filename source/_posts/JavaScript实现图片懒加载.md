---
title: "JavaScript 实现图片懒加载"
date: 2022-06-02
categories: 前端
index_img: images/JavaScript实现图片懒加载-懒加载原理.jpg
tags: [JavaScript]
---

浏览器加载页面时需要加载大量资源，图片的加载是对性能的影响因素之一，大量的图片请求对服务器是不利的。使图片懒加载（按需加载）能大幅度减少对服务器的请求，提高页面的加载速度。

### 懒加载的实现原理

在用户访问界面时，网页往下加载了浏览器窗口还看不到的内容，如果用户关闭网页，那么很明显加载的这部分图片是一种资源的浪费。因此我们并不需要加载所有的图片资源，只需要当浏览器界面滑动到图片的位置时才开始加载。

![懒加载原理](images/JavaScript实现图片懒加载-懒加载原理.jpg)

### 使用监听高度实现

首先我们需要两个数据

1. 浏览器网页窗口的高度

   - window.innerHeight

2. 图片元素距离浏览器顶部的距离

   - getBoundingClientRect().top

     ![参数图示](/images/JavaScript实现图片懒加载-getBoundingClientRect().top.jpg)

在`data-src`设置真实图片链接，`src` 属性可以设置为默认的占位图或空值 （data-\* 属性允许我们在 HTML 元素中存储额外的信息，它不会被浏览器加载和执行）

``` HTML
<body>
    <img src="./default.jpg" data-src="./img0.jpg" alt="">
    <img src="./default.jpg" data-src="./img1.jpg" alt="">
        ...
    <img src="./default.jpg" data-src="./img8.jpg" alt="">
    <img src="./default.jpg" data-src="./img9.jpg" alt="">

    <script src="./lazyLoad.js"></script>

</body>
```

对浏览器滚动行为进行监听，如果图片距离顶部的距离小于浏览器网页窗口的高度的高度，说明图片出现在可视范围内，将其 `data-src` 属性赋予给 `src` 开始请求图片。

``` javascript
const images = document.querySelectorAll('img');

let index = 0;
window.addEventListener("scroll", (e) => {
   if (index == images.length) {
      return;
   }
   for (let i = index; i < images.length; i++) {
      const im_top = images[i].getBoundingClientRect().top;
      if (im_top > window.innerHeight) {
      continue;
   }
   const data_src = images[i].getAttribute('data-src');
   images[i].setAttribute('src', data_src);
   index++;
   }
});
```

以上方法即使在所有图片显示后也会对高度进行监听，因为我们无法直接移除 nodeList 的元素，当然也可以将 nodeList 转换为 Array 数组进行操作。
此方法目前只在兼容浏览器条件下考虑使用，其他情况不建议。

### 使用 IntersectionObserver 接口实现

[IntersectionObserver](https://developer.mozilla.org/zh-CN/docs/Web/API/IntersectionObserver) 接口是浏览器提供的接口 (从属于 Intersection Observer API) ，它提供了一种异步观察目标元素与其祖先元素或顶级文档视窗(viewport)交叉状态的方法。
使用此接口主要有两个方法

1. 设置观测

   - IntersectionObserver.observe(targetElement);

2. 取消观测

   - IntersectionObserver.unobserve(targetElement);

     ![取消IntersectionObserver观测图示](/images/JavaScript实现图片懒加载-取消IntersectionObserver观测图示.jpg)

设置观测图片对图片进行监听后，被观测的图片对象和值保存在一组 IntersectionObserverEntry 对象的列表中，每个 IntersectionObserverEntry 包含了观测目标及其观测状态等信息。
通过获取到的观测状态，我们可以根据图片是被观测到（isIntersecting）控制图片的加载。

``` javascript
const images = document.querySelectorAll('img');

//被观测时执行的方法
const showImage = entries => {
   entries.forEach(entry => {
      if (entry.isIntersecting) {
      const image = entry.target;
      const data_src = image.getAttribute('data-src');
      image.setAttribute('src', data_src);
      observer.unobserve(image);
      }
   });
}
const observer = new IntersectionObserver(showImage);

//为所有图片设置观测
images.forEach(image => {
   observer.observe(image);
});
```

通过设置观测图片和取消观测图片，我们就可以很简单的控制图片的懒加载，而不用担心重复调用的问题。

**注**

使用此接口请优先考虑浏览器的兼容性。
