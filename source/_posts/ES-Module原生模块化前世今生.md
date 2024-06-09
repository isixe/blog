---
title: ES Module 原生模块化前世今生
date: 2023-11-3 16:42
categories: 前端
index_img: /images/ESModule原生模块化前世今生-文件划分的模块.jpg
tags: [JavaScript]
---

模块化是一种有效提高代码质量和可维护性的开发方法，通过将代码拆分成独立的模块，能很好的解决代码冗余和可读性的问题。在前端模块化标准出现之前，我们通过自执行函数闭包来创建模块，但不能解决模块依赖带来的命名冲突和重复导入等问题。随着前端模块化标准的到来。这些问题已经能够得到解决。

<!-- more -->

### 背景

在早期的前端开发中，采用的是文件划分的方式。通过给定不同的 .js 文件名，区分每个模块，即一个 .js 文件对应一个模块。

![文件划分的模块](/images/ESModule原生模块化前世今生-文件划分的模块.jpg)

根据需要，再通过 `<script>` 进行模块文件的引入界面，引入文件中所有的对象都能被外部所获取并修改。

``` HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <title>demo</title>
</head>
<body>
    <script src="demo.js"></script>
        ...
    <script src="demo6.js"></script>
</body>
</html>
```

显而易见，这会产生 `污染全局作用域` 和 `命名冲突` 的问题。所有的对象都存在全局作用域中，可以在未知的情况下被获取和修改，存在潜在问题。并且当需要新声明一个变量时，就不得不考虑其是否存在。

多数情况下，声明的对象用完即弃，而不需要暴露在全局作用域中。这时，就需要一种方案来进一步约束对象的作用范围。

**注**

- 在 ES5 标准之前，只存在全局作用域和函数作用域，并没有 `块级作用域` 的概念。变量使用 var 声明，对全局可见

### 命名空间约束

要约束单个文件中所有对象作用范围，最简单的方式就是将所有对象限制一个对象的 `命名空间` 中。在 JavaScript 中，对象可以包含变量和函数，因此只需要将所有对象附加在这个对象上就能达到约束作用域的效果

moduleA.js
``` javascript
var moduleA = {
variable_a: 10

    variable_b: function(){
        ...
        return 20;
    };

    method:function(){
        console.log('moduleB method');
    }
    ...

};
```

A.HTML
``` HTML
<script src="moduleA.js"></script>
<script>
    console.log(moduleA.variable_a);
    console.log(moduleA.variable_b);
    moduleA.method();
</script>
```

但是很明显，这样并不符合代码的编写顺序，因此我们可以换一种赋值方式。

moduleB.js
``` javascript
var moduleB = {};
moduleB.variable_a = 10;

moduleB.variable_b = function(){
...
return 20;
};

moduleB.method = new function(){
console.log('moduleB method');
}
```

B.HTML
``` HTML
<script src="moduleA.js"></script>
<script>
    console.log(moduleB.variable_a);
    console.log(moduleB.variable_b);
    moduleB.method();
</script>
```

但是，这种方式仅仅减少了 `命名冲突` 的发生，并没有实际解决 `全局作用域的污染` 问题。

### 函数作用域约束

在 ES6 标准后，提出了 [`立即执行函数（Immediately Invoked Functions Expressions, IIFE）`](https://developer.mozilla.org/zh-CN/docs/Glossary/IIFE)，也被成为自执行匿名函数。对于全局作用域污染问题，我们将每个文件代码使用 [立即执行函数（IIFE）](https://developer.mozilla.org/zh-CN/docs/Glossary/IIFE) 进行包裹，即将代码约束在函数作用域中。对于需要共享到全局的变量，可以将其附加到的 window 全局对象中，然后通过 window 对象取出变量。

moduleC.js
``` javascript
(function(){}
let variable_a = 10;

    let variable_b = function(){
        ...
        return 20;
    }

    function method (){
        console.log('moduleA method');
    }
    ...

    window.moduleC = {
        variable_a : variable_a,
        variable_b : variable_b,
        method : method
    }

)();

// or

(()=>{}
const variable_a = 10;

    const variable_b = () => {
        ...
        return 20;
    }

    const method = () => {
        console.log('moduleB method');
    }
    ...

    window.moduleC = {
        variable_a : variable_a,
        variable_b : variable_b,
        method : method
    }

)();
```

HTML
``` HTML
<script src="moduleA.js"></script>
<script>
    const { moduleC } = window;

    console.log(moduleC.variable_a);

    console.log(moduleC.variable_b);

    moduleC.method();
</script>
```

相对于对 `命名空间约束`，函数作用域约束完全隔绝了 `全局作用域`，通过更好的全局变量传递方法，最终避免了对象直接滞留在 `全局作用域` 中。

至此，前端模块化已经取得了较好的解决方案，`全局作用域污染` 和 `命名冲突` 问题也得到了解决，该方案很长一段时间成为模块化的主流。

但是，还存在一个潜在的问题，window 对象在当前界面始终存在，也因此其子对象不会被内存回收机制所销毁，可能会引起内存消耗问题。

并且，对于多个层级单向依赖的模块，我们需要使用 `<script>` 将其全部模块导入界面，如果缺少任意一个模块，模块就不再可用，这并不利于在模块的基础上进行扩展。实际上对于模块的导入，只需要导入最外层扩展的模块，就像 Java 中的继承一样。因此， `ES Module 模块化标准` 悄然现身。

### ES Module 模块化标准

ES Module 标准中，在原有 `<script>` 的基础上，通过设置 `type="module"` 来声明为 ES Module。ES Module 将作用域限制在单个模块中，并且强制地使用 [严格模式（'use strict'）](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Strict_mode)。另外，模块将延迟加载，不会阻塞界面的渲染。

``` HTML
<script type="module" src="module.js"></script>
```

从 ES6 开始，支持 [import](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/import) 和 [export](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/export) 语法，用于 .js 文件中导入模块和导出对象。使用 [export](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/export) 的模块代码会在 [import](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/import) 后被执行，即使用 [export](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/export) 的模块将被导入使用 [import](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/import) 模块中。

因此，为了避免环形导入问题，包含 [export](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/export) 的模块不能使用 `<script type="module">` 导入界面。也就是说，将单独使用 [import](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/import) 的模块导入界面既可。

假设 ESModuleB 模块依赖于 ESModuleA 模块，则只需要导入 ESModuleB 模块

![ES Module 模块](/images/ESModule原生模块化前世今生-ESModule模块.jpg)

ESModuleA.js
``` javascript
const variable = 10;

const method = () => {
console.log('ESModuleA');
}

export { variable, method }
{% endhighlight %}

ESModuleB.js
{% highlight javascript %}
import { variable, method } from './ESModuleA.js'

console.log(variable);
method();
```

``` HTML
<script type="module" src="ESModuleB.js"></script>
```

**注**

- 对于在线引入的 JavaScript 文件，声明为 ES Module 需要支持 `CORS` 的跨域请求方式。

### 兼容性

`ES Module 模块化标准` 提供了近乎完美的前端模块化解决方案，但还存在部分浏览器不兼容的问题。

针对该问题，可以通过使用 [browser-es-module-loader](https://github.com/ModuleLoader/browser-es-module-loader) 和 [promise-polyfill](https://github.com/taylorhakes/promise-polyfill) 模拟 `ES Module 模块化` 来进行适配。

只需在界面中引入以下 `<script>` 既可。其中， `nomodule` 选项用于避免在支持 `ES Module 模块化标准` 的浏览器中重复执行。

``` HTML
<script nomodule src="https://unpkg.com/browser-es-module-loader@0.4.1/dist/browser-es-module-loader.js"></script>
<script nomodule src="https://unpkg.com/browse/browser-es-module-loader@0.4.1/dist/babel-browser-build.js"></script>
<script nomodule src="https://unpkg.com/polyfill@0.1.0/index.js"></script>
```

**注**

- 兼容性请查看：<i>[MDN Modules](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Modules)</i>

### 后记

随着浏览器的不断支持，`ES Module 模块化标准` 也逐渐可用，该标准已经成为了模块化方案的最优解。实际上，当我写下这篇博客前，已经使用 `ES Module 模块化标准` 对当前网站进行了重构，同时解决了部分遗留问题，总体而言，结果是好的。

如果你耐心的看到了最后，不妨尝试一下这个标准，或许会有意料之外的收获。
