# jquery.hash [![spm version](http://spmjs.io/badge/jquery.hash)](http://spmjs.io/package/jquery.hash)
AUTHOR WEBSITE: [http://ydr.me/](http://ydr.me/)

Simple to operate hash.

__IT IS [A spm package](http://spmjs.io/package/jquery.hash).__




#USAGE
```
var $ = require('jquery');
require('jquery.hash')($);

// 1. options
$.hash(options);

// 2. get
$.hash().get();
$.hash().get("a");
$.hash().get(["a", "b"]);

//3. set
$.hash().set("key", "val", "!");
$.hash().set({"key1":"val1", "key2": "val2"}, "?");

// 4. remove
$.hash().remove("key");
$.hash().remove(["key1", "key2"]);
$.hash().remove();

// 5. listen
$.hash().listen("key", fn);
$.hash().listen("key1", "key2", fn);
$.hash().listen(["key1", "key2"], fn);
$.hash().listen(fn);

// 6. suffix
$.hash().suffix();
$.hash().suffix('123');
```



#OPTIONS
```
defaults = {
    // 传入hash值，为空时默认为当前window.location.hash
    hash: ''
}
```


#SET OPTIONS
```
$.hash.defaults;
```


