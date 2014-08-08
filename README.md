# jquery.hash

---

[![spm version](http://spmjs.io/badge/jquery.hash)](http://spmjs.io/package/jquery.hash)

jquery.hash 监听、设置、获取hash

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


## HashType

### HashType `!`
`#!a/1/b/2/c/3`

### HashType `?`
`#?a=1&b=2&c=3`


## Api

### Options
```js
$.hash.defaults = {
    // 传入hash值，为空时默认为当前window.location.hash
    hash: '',
    // 默认hashtype
    type: '!'
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
$.hash().set("key", "val");
$.hash().set({
	"key1":"val1",
	"key2": "val2"
});
```

#### remove
```js
$.hash().remove("key");
$.hash().remove(["key1", "key2"]);
$.hash().remove();
```


#### stringify
```js
$.hash().set("key", "val").remove("a").stringify("!");
$.hash().set("key", "val").remove(["a", "b"]).stringify("?");
```


#### location
```js
$.hash().set("key", "val").remove("a").location("!");
$.hash().set("key", "val").remove(["a", "b"]).location("?");
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





## Demo
[http://spmjs.io/docs/jquery.hash/examples/index.html](http://spmjs.io/docs/jquery.hash/examples/index.html)


## History
[http://spmjs.io/docs/jquery.hash/history.html](http://spmjs.io/docs/jquery.hash/history.html)

