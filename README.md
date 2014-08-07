# jquery-drag

---

[![spm version](http://spmjs.io/badge/jquery-drag)](http://spmjs.io/package/jquery-drag)

jQuery 鼠标拖拽插件

---

## Install

```
$ spm install jquery.hash --save
```

## Usage

It is very easy to use this module.

```js
// require jquery
var $ = require('jquery');

// extend jquery
require('jquery.hash')($);

// use
$.hash();
```


## Api

### Options
```js
$.hash.defaults = {
    // 传入hash值，为空时默认为当前window.location.hash
    hash: ''
}
```

### Functions

#### get
```js
$.hash().get();
$.hash().get("a");
$.hash().get(["a", "b"]);
```

#### set
```js
$.hash().set("key", "val", "!");
$.hash().set({"key1":"val1", "key2": "val2"}, "?");
```

#### remove
```js
$.hash().remove("key");
$.hash().remove(["key1", "key2"]);
$.hash().remove();
```

#### listen
```js
// listen one
$.hash().listen("key", fn);

// listen or
$.hash().listen("key1", "key2", fn);

// listen both
$.hash().listen(["key1", "key2"], fn);

// listen all
$.hash().listen(fn);
```


#### get suffix
```js
$.hash().suffix();
```



#### set suffix
```js
$.hash().suffix('123');
```


