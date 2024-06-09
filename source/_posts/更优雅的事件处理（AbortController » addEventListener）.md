---
title: "更优雅的事件处理（AbortController » addEventListener）"
date: 2023-1-30 18:30
categories: 前端
tags: [JavaScript]
---

我们知道如果使用 removeEventListener(type, callback, useCapture) ，提供的参数必须与已添加事件一致，且 callback 不能是匿名函数或带参函数。某些情况下，我们不想多写函数用于引用，或着需要销毁多个事件，可以使用 AbortController 来处理。

<!-- more -->

### AbortController 背景介绍

AbortController 是一个通用的 DOM API。AbortController 接口表示一个控制器对象，允许根据需要中止一个或多个 Web 请求。

AbortController 常用于 fetch 和 addEventListener，分别用来废弃请求和废弃监听器。

| 属性   | 描述                                                                            |
| :----- | :------------------------------------------------------------------------------ |
| signal | 只读。返回一个 AbortSignal 对象实例，它可以用来 with/abort 一个 Web（网络）请求 |

| 方法    | 说明                                                                                                                                   |
| :------ | :------------------------------------------------------------------------------------------------------------------------------------- |
| abort() | 只读。中止一个尚未完成的 Web（网络）请求，用时为 AbortSignal 对象传入 aborted 状态为 true。这能够中止 fetch 请求及任何响应体的消费和流 |

- AbortSignal 表示一个信号对象（signal object），它允许你通过 AbortController 对象与 DOM 请求（如 Fetch）进行通信并在需要时将其中止。

  | 属性    | 描述                                                        |
  | :------ | :---------------------------------------------------------- |
  | aborted | 只读。表示与之通信的请求是否被终止（true）或未终止（false） |
  | reason  | 只读。提供一个使用 JavaScript 值表示的中止原因              |

  | 方法             | 说明                                                          |
  | :--------------- | :------------------------------------------------------------ |
  | throwIfAborted() | 如果信号已经被中止，则抛出信号中止的 reason；否则没有任何用处 |
  | abort()          | 返回一个已经被设置为中止的 AbortSignal 实例                   |
  | timeout()        | 返回一个在指定事件后将自动终止的 AbortSignal 实例             |

  | 事件  | 说明                                                               |
  | :---- | :----------------------------------------------------------------- |
  | abort | 当与 signal 通信 DOM 请求被中止时调用。也可以通过 onabort 属性调用 |

### addEventListener 可选参数

在此之前，我们先复习一下 addEventListener 的知识。

addEventListener(type, callback, options) 有一个可选的 options 参数，允许传入 signal。

| 参数     | 描述                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| :------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type     | 表示监听事件类型的大小写敏感的字符串。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| callback | 当所监听的事件类型触发时，会接收到一个事件通知（实现了 Event 接口的对象）对象。callback 必须是一个实现了 EventListener 接口的对象，或者是一个函数。                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| options  | 一个指定有关 callback 属性的可选参数对象。可用的选项如下： <br>capture： <br>可选一个布尔值，表示 callback 会在该类型的事件捕获阶段传播到该 EventTarget 时触发。<br><br>once：<br>可选。 一个布尔值，表示 callback 在添加之后最多只调用一次。如果为 true，callback 会在其被调用之后自动移除。<br><br>passive：<br>可选。一个布尔值，设置为 true 时，表示 callback 永远不会调用 preventDefault()。如果 callback 仍然调用了这个函数，客户端将会忽略它并抛出一个控制台警告。查看使用 passive 改善滚屏性能以了解更多。<br><br>**signal：<br>可选。AbortSignal，该 AbortSignal 的 abort() 方法被调用时，监听器会被移除。** |

### 事件处理

我们可以将 AbortController.signal 传入 addEventListener 的 option 参数中，从而控制事件的销毁

例如，我们可以通过两个按钮控制鼠标移动事件的创建和销毁，其中，鼠标移动事件中输出mousemove字符到控制台，按钮点击事件负责控制 AbortController 的中断逻辑。

``` HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <title>AbortController</title>
</head>
<body>
    <button id="start">start event</button>
    <button id="end">cancel</button>
</body>
</html>
```

JavaScript：

``` javascript
const eventBtn = document.querySelector('#start');
const cancelBtn = document.querySelector('#end');

const handler = () => console.log('mousemove');

const controller = new AbortController();
const { signal } = controller;

eventBtn.addEventListener('click', () => {
    document.addEventListener('mousemove', handler, { signal });
});

cancelBtn.addEventListener('click', () => {
    controller.abort();
});
```

通过以上代码，我们成功对事件进行了销毁，再次点击并不会有效果。因为 AbortController.signal 参数是只读的，abort() 方法执行后事件只会永远被销毁，也就是说 AbortController 是一次性的。

但是多数情况下，我们需要再次点击按钮，让事件再次可用。为了达到这个效果，我们需要修改原有代码：

``` javascript
const eventBtn = document.querySelector('#start');
const cancelBtn = document.querySelector('#end');

const handler = () => console.log('mousemove');

let controller = new AbortController();

eventBtn.addEventListener('click', () => {
    //中断原有的 AbortController
    if (controller) controller.abort();

    //实例化新的 AbortController
    controller = new AbortController();
    const { signal } = controller;

    document.addEventListener('mousemove', handler, { signal });
});

cancelBtn.addEventListener('click', () => {
    controller.abort();
});
```

我们在基础上，再次点击按钮时，对原有的 AbortController 进行中断，重新实例化新的 AbortController 对象，并获取 signal 传入事件既可。

此时 AbortController.signal 中的 AbortSignal.aborted 为 false，默认不会销毁事件。

### 多事件处理

如果需要同时对多个事件进行销毁也很好理解了，只需要为所有事件传入 signal 值既可，相比原有的 removeEventListener ，也更加直观。

``` javascript
...

eventBtn.addEventListener('click', () => {

    ...

    document.addEventListener('mousemove', handler, { signal });
    document.addEventListener('mouseup', handler, { signal });
    document.addEventListener('mousedown', handler, { signal });

});
cancelBtn.addEventListener('click', () => {    controller.abort();});
```

### 处理匿名函数和带参函数

通过以上示例，我们已经了解到，通过 AbortController 对事件注销没有任何限制，只需要提供 signal 参数。

那么对于事件中的匿名函数和带参函数的处理也是同样适用的，以上述代码为例：

``` javascript
const eventBtn = document.querySelector('#start');
const cancelBtn = document.querySelector('#end');

let controller = new AbortController();

eventBtn.addEventListener('click', () => {
    //中断原有的 AbortController
    if (controller) controller.abort();

    //实例化新的 AbortController
    controller = new AbortController();
    const { signal } = controller;

    //匿名函数
    document.addEventListener('mousemove', () => {
        console.log('mousemove')
    }, { signal });

        const param = "mousemove";

    //带参函数
    document.addEventListener('mousemove', (e, param) => {
        console.log(param);
    }, { signal });

});

cancelBtn.addEventListener('click', () => {
    controller.abort();
});
```

### 总结

至此，AbortController 对事件的处理是否让你眼前一亮呢，不过我们也需要考虑到兼容性问题

具体兼容性请参考

- [https://caniuse.com/?search=AbortController](https://caniuse.com/?search=AbortController)

- [https://developer.mozilla.org/zh-CN/docs/Web/API/AbortController/AbortController](https://developer.mozilla.org/zh-CN/docs/Web/API/AbortController/AbortController#%E6%B5%8F%E8%A7%88%E5%99%A8%E5%85%BC%E5%AE%B9%E6%80%A7)

AbortController 的总体兼容性比较完好，除了 IE 和 Opera Mini 完全不被支持<del>（反正没多少人用）</del>，和在低版本浏览器内核中不适用外，都可以正常使用。
