---
title: JavaScript 模块化标准的演化（CommonJS › AMD › CMD › ES Module）
date: 2023-11-5 22:07
categories: 前端
index_img: /images/JavaScript模块化标准的演化（CommonJS›AMD›CMD›ESModule）-模块化标准演化过程.jpg
tags: [JavaScript]
---

从初步认识到模块化到实践求证，在这个过程中我深受启发，也得知了模块化的必要性。于是，我决定进一步将 NodeJS 和原生模块标准进行梳理，为深入学习两者铺好道路。

<!-- more -->

### 背景

最初，JavaScript 没有模块化标准 , 所有的代码都在全局作用域执行。随着对前端模块化的初步尝试，社区开始出现了模块化解决方案。

![模块化标准的演化过程](/images/JavaScript模块化标准的演化（CommonJS›AMD›CMD›ESModule）-模块化标准演化过程.jpg)

最早在 2009 年由 JavaScript 的社区提出一个用于服务端的模块化规范，即 `CommonJS` 规范。随即 NodeJS 出现，很好地实现了该规范，推出之后立即受到好评。

`CommonJS` 规范的思想是在运行时加载模块，使用同步的方式加载并获取模块对象。

- 在服务端，模块文件都存放在本地磁盘，读取非常快，所以不会有问题。
  <br>
- 在浏览器端，模块文件以网络请求的方式获取，限制于网络速度，如果使用 `CommonJS` 规范就会导致阻塞页面加载的问题。因此，这种方法并不理想。

为了解决在浏览器中加载模块的难题，随后出现了 `AMD` 和 `CMD` 两种解决方案。但是，这两种解决方案的增加了代码的复杂性，提高了开发成本。随着新标准的产生，`AMD` 和 `CMD` 成为了历史。

`ES Module 模块化标准` 诞生于 ES6 标准，从语法层面实现了模块化，避免了这种问题。

### CommonJS 规范

[CommonJS](https://nodejs.org/api/modules.html#modules-commonjs-modules) 在 2009 年由 Mozilla 的工程师 Kevin Dangoor 提出，主要用于服务端 JavaScript 的模块化。不久后，该标准在 NodeJS 中得到实现。

[CommonJS](https://nodejs.org/api/modules.html#modules-commonjs-modules) 规范使用一种运行时加载的机制，执行时同步地加载模块文件，执行完成后才会确定模块导出的对象。因此，可以通过动态的控制加载的模块，例如用变量作为导入路径，或者通过 if 语句条件导入。在这个过程中，其他操作将会等待同步加载完成后继续执行。

NodeJS 中对于一个模块，可以使用 require() 方法引入其他模块，并通过 module.exports 将自己的内容导出给其他模块使用。

![CommonJS 模块化语法](/images/JavaScript模块化标准的演化（CommonJS›AMD›CMD›ESModule）-CommonJS模块化语法.jpg)

[CommonJS](https://nodejs.org/api/modules.html#modules-commonjs-modules) 加载的是一个对象（即 `module.exports` 属性），该对象只有在模块运行结束才会生成。

**注**

- [CommonJS](https://nodejs.org/api/modules.html#modules-commonjs-modules) 模块导出的是对象的拷贝，模块运行结束，对象的值就被确定。即使模块内部对象被更改，也不会影响其拷贝值。

### AMD 规范

`AMD (Asynchronous Module Definition)` 规范采用异步方式加载模块，模块的加载不影响它后面语句的运行。

在 `AMD` 规范中，我们使用 define 定义模块，使用 require 加载模块。

定义模块时需要指定所有的 `dependencies` 模块依赖，并且还要传入参数到 `factory` 参数中，对于依赖的模块提前执行

> define(id?, dependencies?, factory);

| 属性         | 解释                                                                                                                                                                                                                                                                             |
| :----------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id           | 定义的模块名，参数可选，但不推荐使用，因为文件被移动就需要更新该值。<br><br>如果没有定义该参数，模块名字应该默认为模块加载器请求的指定 `js` 的文件名。<br><br>模块的名字应该默认为模块加载器请求的指定脚本的名字。如果提供了该参数，模块名必须是顶级的和绝对的（不允许相对名字） |
| dependencies | 是定义的模块中所依赖的模块数组，也是可选的，依赖模块执行结果按照数组中的排序依次传入对于 factory 参数                                                                                                                                                                            |
| factory      | 是模块初始化要执行的函数或对象，这是必需的。                                                                                                                                                                                                                                     |

所有依赖于加载模块的语句，都定义在 `callback` 函数中，等到依赖模块 `[module]` 加载完成之后，`callback` 函数才会运行

> require([module], callback);

| 属性     | 解释                                 |
| :------- | :----------------------------------- |
| module   | 一个数组，里面的就是包含要加载的模块 |
| callback | 模块加载成功之后的回调函数           |

[RequireJS](https://requirejs.org/) 是一个 JavaScript 模块加载器，实现了 `AMD` 规范。

使用 [RequireJS](https://requirejs.org/) 需要引入 require.js 文件，并指定 `data-main` 属性作为模块的根路径。或者，通过 `require.config()` 指定模块的根路径。

``` JavaScript
<script data-main="js/main.js" src="js/lib/require.js"></script>
```

[`RequireJS`](https://requirejs.org/) 实现了模块之间的依赖引用，并且可以并行加载多个模块。

![RequireJS 模块化语法](/images/JavaScript模块化标准的演化（CommonJS›AMD›CMD›ESModule）-RequireJS模块化语法.jpg)

但是，这种规范增加了代码的复杂性，必须提前加载所有的依赖，而不能按需加载，提高了开发成本。

#### 注

- 如果 `<script>` 有指定 `data-main` 属性，也就是有指定入口文件，则以入口文件所在的路径为模块根路径
  <br>
- 如果 `<script>` 标签引入 require.js 时没有指定 `data-main` 属性，则以当前 HTML 文件所在的路径为模块根路径
  <br>
- 如果在 `require.config()` 中有配置 `baseUrl`，则以 `baseUrl` 的路径为模块根路径。

### CMD 规范

[CMD（Common Module Definition）](https://github.com/cmdjs/specification/blob/master/draft/module.md) 支持异步加载模块，与 AMD 规范类似，也用于浏览器端。

[CMD](https://github.com/cmdjs/specification/blob/master/draft/module.md) 规范使用 `define` 函数来定义模块，使用 `require` 函数来加载模块

定义模块时只需要传入参数到 `factory` 参数中，不需要预先指定依赖

> define(factory);

| 属性    | 解释                                     |
| :------ | :--------------------------------------- |
| factory | 可以是一个函数，也可以是一个对象或字符串 |

引用时只指定单个模块，通过模块标识作为唯一参数，用于依赖模块

> require(id);

| 属性 | 解释     |
| :--- | :------- |
| id   | 模块标识 |

[SeaJS](https://github.com/seajs/seajs) 是一个模块加载器，实现了 [CMD](https://github.com/cmdjs/specification/blob/master/draft/module.md) 规范，[SeaJS](https://github.com/seajs/seajs) 旨在向 `CommonJS` 规范的语法靠近，降低开发成本。

使用 [SeaJS](https://github.com/seajs/seajs) 需要引入 sea.js 文件，并且在 `<script>` 中指定加载的主模块文件。

``` JavaScript
<script src='./sea.js'></script>
<script>
    seajs.use('./module');
</script>
```

[SeaJS](https://github.com/seajs/seajs) 实现了按需加载，只在当需要引用代码模块进行加载，并且可以做到条件加载，这使得模块化在实际使用中可以更加灵活的控制。

![SeaJS 模块化语法](/images/JavaScript模块化标准的演化（CommonJS›AMD›CMD›ESModule）-SeaJS模块化语法.jpg)

[SeaJS](https://github.com/seajs/seajs) 在模块化上进一步做到了易用性，但还需要配和使用 `SPM` 工具、JS 的打包和管理工具，仍然没有减少开发成本。

### ES Module 规范（标准）

[ES Module](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Modules) 是 ES6（2015 年）引入的标准，从语法层面提供了模块化的功能，目的是为了在浏览器中实现模块化标准。

[ES Module](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Modules) 标准使用在编译时加载的机制。执行时异步地加载模块文件，模块导出的对象执行前就已经被确定。因此，默认情况下，模块是静态加载的。在这个过程中，其他操作将会异步地执行，不会被阻塞。

如果需要，可以使用 import() 函数控制模块动态加载，该函数返回一个异步的 `Promise` 对象

对于一个模块，可以使用 `import` 或 `improt()` 函数引入其他模块，并通过 `export` 将自己的内容导出给其他模块使用。

![ES Module 模块化语法](/images/JavaScript模块化标准的演化（CommonJS›AMD›CMD›ESModule）-ESModule模块化语法.jpg)

此外，在编译阶段，引入的模块被提升至模块顶部。在 `import` 前的代码也不会在模块导入前执行，如果在 `import` 前使用模块导出的对象，也不会导致任何错误。

`ES Module` 使静态分析成为可能。此外，`ES Module` 不是对象，`import` 命令会被 JavaScript 引擎静态分析，在编译时就引入模块代码。

#### 注

- [ES Module](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Modules) 导出的是对象的引用，即使模块被导出，随后通过调用模块内部函数更改该对象时，引用也会被更改。

- `import` 和 `export` 只能在模块的顶层，不能在代码块之中（比如 if 代码块之中，或在函数之中）

### CommonJS vs ES Module

`CommonJS` 和 `ES Module` 中，模块是封闭的，具有独立的作用域，模块内部的变量、函数和对象对外部不可见，只有明确通过导出的方式才能被其他模块使用。不过，两者在实现上存在着以下差异。

| 模块化方案 | 导出                | 导入                          | 加载方式 | 导出对象 | 对象定义 |
| :--------- | :------------------ | :---------------------------- | :------- | :------- | :------- |
| CommonJS   | module.export = { } | require('./module.js')        | 同步     | 拷贝     | 静态     |
| ES Module  | export { }          | import { } from './module.js' | 异步     | 引用     | 动态     |

两者都支持动态导入模块，都可以在运行时加载。但是区别是 `ES Module` 是通过异步请求模块文件获取，而 `CommonJS` 是通过同步读取模块文件获取。

### 结语

通过对模块化标准演化的历史的梳理，理清了前端发展的方向，这使得我们在看待 NodeJS 和原生模块化的差异时，能够减少疑惑。同时，更好地将两者更好的区分开来，防止两种技术的混淆。
