## window.location  ---host,href,protocol

```js
 // redirect http to https
    if (window.location.protocol !== "https:" && host == 'www.shanbay.com') {
        window.location.href = "https:" + window.location.href.substring(window.location.protocol.length);
    }
```

## 把字显示在图片上
.text-desc


## carousel的使用
+ 类的嵌套顺序 container---carousel slide---carousel-inner---item active