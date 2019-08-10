这是FCC	前端框架的一个项目。

功能相对简单：异步获取quotes.json，得到数据quotes，每次点击按钮"New quote",就随机将quotes中的一个名言渲染到页面。最简单的方式，也是我的做法，就是通过innerText直接操作DOM来更新quote.

这个项目可以做的更为复杂，比如做成一个类似微博，Twitter的首页，使用React完成quote-box组件，将quotes中的数据传入组件渲染即可，并可以用state存储组件的相关信息，比如是否销毁。其实就类似TodoList了。

## 用到的功能
+ Fetch请求
+ return fetch()作为异步
+ flex布局

## 需要做的改进
+ 模仿知乎想法的UI