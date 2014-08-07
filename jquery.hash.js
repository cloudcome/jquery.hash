/**
 * jquery.hash
 * @author  ydr.me
 */



module.exports = function($) {
    'use strict';

    var 
        udf,
        win = window,
        defaults = {
            // 传入hash值，为空时默认为当前window.location.hash
            hash: '',
            // 默认类型
            type: '!'
        },
        encode = encodeURIComponent,
        decode = decodeURIComponent,
        // [fn1, fn2, ...]
        listenAllCallbacks = [],
        // {
        //    "key1": {
        //        "callbacks": [fn1, fn2]
        //    },
        // }
        listenOneMap = {},
        // 1个键与1个或多个键保持OR关系
        // {
        //    "key1": {
        //        "keys": ["key2", "key3"],
        //        "callbacks": [fn1, fn2]
        //    },
        // }
        listenOrMap = {},
        // 1个键与1个或多个键保持AND关系
        // {
        //    "key1": {
        //        "keys": ["key2", "key3"],
        //        "callbacks": [fn1, fn2]
        //    },
        // }
        listenAndMap = {},
        hashEqualMap = {
            '!': '/',
            '?': '='
        },
        hashSplitMap = {
            '!': '/',
            '?': '&'
        },
        regConstructorReplace = /^[^#]*/,
        regConstructorWhich = /^(#[^#]*)(#?.*)$/,
        isArray = $.isArray,
        inArray = $.inArray,
        each = $.each;



    $.hash = function(settings) {
        if ($.type(settings) === 'string') settings = {
            hash: settings
        };

        var options = $.extend({}, defaults, settings);
        options.hash = options.hash || win.location.hash;
        return new Constructor(options)._parse();
    };
    $.hash.defaults = defaults;


    $(win).bind('hashchange', function(eve) {
        var 
            oe = eve.originalEvent,
            newRet = $.hash(oe.newURL).get(),
            oldRet = $.hash(oe.oldURL).get(),
            // {
            //    "a": {
            //        old: '1',
            //        new: '2',
            //    },
            // }
            changeMap = {},
            changeKeys = [],
            changeKeysLength,
            oneCallbacks = [],
            orCallbacks = [],
            andCallbacks = [];

        each(newRet, function(key, val) {
            if (oldRet[key] !== val && changeMap[key] === udf) {
                changeMap[key] = {
                    'old': oldRet[key],
                    'new': val
                };
                changeKeys.push(key);
            }
        });

        each(oldRet, function(key, val) {
            if (newRet[key] !== val && changeMap[key] === udf) {
                changeMap[key] = {
                    'old': val,
                    'new': newRet[key]
                };
                changeKeys.push(key);
            }
        });

        if (!(changeKeysLength = changeKeys.length)) return;

        each(changeKeys, function(i, changeKey) {
            var andKeys, unfind;

            if (listenOneMap[changeKey]) {
                each(listenOneMap[changeKey].callbacks, function(index, callback) {
                    if (!~inArray(callback, oneCallbacks)) oneCallbacks.push(callback);
                });
            }

            if (listenOrMap[changeKey]) {
                each(listenOrMap[changeKey].callbacks, function(index, callback) {
                    if (!~inArray(callback, orCallbacks)) orCallbacks.push(callback);
                });
            }

            if (listenAndMap[changeKey]) {
                andKeys = listenAndMap[changeKey].keys;
                // 匹配AND关系里的key是否都在当前changeKeys里
                each(andKeys, function(index, key) {
                    if (!~inArray(key, changeKeys)) {
                        unfind = !0;
                        return !1;
                    }
                });

                if (!unfind) {
                    each(listenAndMap[changeKey].callbacks, function(index, callback) {
                        if (!~inArray(callback, andCallbacks)) andCallbacks.push(callback);
                    });
                }
            }
        });



        each(oneCallbacks, function(index, callback) {
            callback(newRet, oldRet);
        });
        each(orCallbacks, function(index, callback) {
            callback(newRet, oldRet);
        });
        each(andCallbacks, function(index, callback) {
            callback(newRet, oldRet);
        });
        each(listenAllCallbacks, function(index, callback) {
            callback(newRet, oldRet);
        });
    });


    // constructor

    function Constructor(options) {
        this.options = options;
    }

    Constructor.prototype = {
        /**
         * 重置 _equal、_split
         */
        _reset: function() {
            var that = this;
            that._equal = hashEqualMap[that._type];
            that._split = hashSplitMap[that._type];
        },





        /**
         * 解析
         */
        _parse: function() {
            var 
                that = this,
                options = that.options,
                hash = options.hash,
                matches,
                ret = {},
                arr,
                lastKey;

            hash = hash.replace(regConstructorReplace, '');
            if (hash[1] !== '!' && hash[1] !== '?'){
                that._type = options.type;
                that._reset();
                that._suffix = '';
                that._result = {};
                return that;
            }

            matches = hash.match(regConstructorWhich);
            that._hash = matches[1];
            that._suffix = matches[2];

            that._type = that._hash[1];
            that._reset();
            that._result = ret;

            that._hash = that._hash.replace(/^[#!?\/]+/, '');
            arr = that._hash.split(that._split);

            // /a/1/2/3/
            // /a/1/2/3
            // a/1/2/3
            // a/1/2/3/
            if (that._type === '!') {
                each(arr, function(index, val) {
                    if (index % 2) {
                        if (lastKey) ret[lastKey] = decode(val);
                    } else {
                        lastKey = val;
                        if (val) ret[val] = '';
                    }
                });
            }
            // a=1&b=2&c=3
            // a=1&b=2&c=
            // a=1&b=2&c
            // a=1&b=2&
            else if (that._type === '?') {
                each(arr, function(index, part) {
                    var pos = part.indexOf(that._equal),
                        key = part.slice(0, pos),
                        val = decode(part.slice(pos + 1));

                    if (key) ret[key] = val || '';
                });
            }

            that._result = ret;
            return that;
        },



        /**
         * 根据当前解析结果字符化并改变window.location.hash
         * @return window.lcoation.hash
         * @version 1.0
         * 2014年6月30日17:31:55
         */
        stringify: function() {
            var that = this,
                arr = [];

            each(that._result, function(key, val) {
                arr.push(key + that._equal + encode(val));
            });

            that._hash = that._type + arr.join(that._split);
            location.hash = that._hash + that._suffix;

            return location.hash;
        },



        /**
         * 设置
         * @param {String/Object} key  hash键或者hash键值对
         * @param {String}        val  hash值或hash类型
         * @param {String}        type hash类型
         * 会自动设置浏览器的hash
         * @version 1.0
         * 2014年6月30日17:31:55
         */
        set: function(key, val, type) {
            var map = {},
                hasChange, that = this,
                i;
            // .set(obj)
            if (val === udf) map = key;
            // .set(str, str)
            // .set(obj, str)
            else if (type === udf) {
                if ($.type(key) === 'object') {
                    map = key;
                    that._type = val;
                    that._reset();
                } else {
                    map[key] = val;
                }
            }
            // .set(str, str, str)
            else {
                map[key] = val;
                that._type = type;
                that._reset();
            }

            for (i in map) {
                map[i] = '' + map[i];
                // 脏检查
                if (that._result[i] != map[i]) {
                    hasChange = !0;
                    that._result[i] = map[i];
                }
            }

            if (hasChange) that.stringify();

            return this;
        },



        // toggle: function() {},


        /**
         * 获取
         * @param  {String/Array} key 单个键或多个键数组
         * @return {String/Object}    单个值或键值对
         * @version 1.0
         * 2014年6月30日17:36:00
         */
        get: function(key) {
            if (key === udf) return this._result;

            var isMulitiple = isArray(key),
                keys = isMulitiple ? key : [key],
                ret = {},
                that = this;

            each(keys, function(index, key) {
                ret[key] = that._result[key];
            });

            return isMulitiple ? ret : ret[key];
        },









        /**
         * 移除
         * @param  {String/Array} key 单个键或多个键数组
         * @version 1.0
         * 2014年6月30日17:40:35
         */
        remove: function(key) {
            if (key === udf) {
                this._result = {};
                this.stringify();
                return;
            }
            var isMulitiple = isArray(key),
                keys = isMulitiple ? key : [key],
                that = this;

            each(keys, function(index, key) {
                delete(that._result[key]);
            });

            that.stringify();
        },








        /**
         * 监听
         * $.hash().listen("key", fn);
         * $.hash().listen("key1", "key2", fn);
         * $.hash().listen(["key1", "key2"], fn);
         * $.hash().listen(fn);
         * @version 1.0
         * 2014年7月1日11:27:46
         */
        listen: function() {
            var args = arguments,
                argL = args.length,
                arg0 = args[0],
                fn = args[argL - 1],
                isAnd = argL === 2 && isArray(arg0),
                isOr = argL > 2,
                isAll = argL === 1,
                isOne = !isAnd && !isOr && !isAll,
                keys = [],
                father;

            // .listen(fn)
            if (isAll) {
                father = listenAllCallbacks;
            }
            // .listen('key', fn)
            else if (isOne) {
                keys = [arg0];
                father = listenOneMap;
            }
            // listen('key1', 'key2', fn);
            else if (isOr) {
                keys = [].slice.call(args, 0, argL - 1);
                father = listenOrMap;
            }
            // listen(['key1', 'key2'], fn);
            else {
                keys = arg0;
                father = listenAndMap;
            }

            if (isAll) {
                if (!~inArray(fn, father)) father.push(fn);
            } else {
                each(keys, function(i, key) {
                    if (father[key] === udf) father[key] = {};
                    if (keys.length > 1 && father[key].keys === udf) father[key].keys = [];
                    if (father[key].callbacks == udf) father[key].callbacks = [];

                    var keysStack = father[key].keys,
                        callbacks = father[key].callbacks;

                    if (father[key].keys) each(keys, function(j, k) {
                        if (!~inArray(k, keysStack) && k !== key) keysStack.push(k);
                    });

                    if (!~inArray(fn, callbacks)) callbacks.push(fn);
                });
            }
        },






        /**
         * 设置或读取hash的suffix部分
         * @param  {String} val 设置值
         * @return {String}     读取值
         */
        suffix: function(val) {
            var that = this;
            if (val === udf) return that._suffix;

            that._suffix = '#' + val;
            that.stringify();

            return that;
        }
    };

};
