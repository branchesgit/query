var
    document = window.document,

    Query = function (selector, context) {
        return new Query.fn.init(selecotr, context);
    },

    hasOwn = Object.prototype.hasOwnProperty,

    toString = Object.prototype.toString;

class2type = {};

var rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/;

Query.fn = Query.prototype = {

    init: function (selector, context) {

        var match, elem, len, i = 0,
            type = Query.type(selector);

        if (type === "string") {

            if (selector.charAt(0) == "<" && selector.charAt(selector.length - 1) === ">" && selector.length >= 3) {
                match = [null, selector, null];
            } else {
                match = rquickExpr.exec(selector);
            }

            if (match && match[1]) {
                elem = (context || document).querySelector(match[1]);
                len = elem && elem.length || 0;

                while (i < len) {
                    this[i] = elem[i];
                    i++
                }

                this.selector = selector;
                this.context = context || document;
            }

            return this;

        } else if (type == "function") {
            $(document).ready(selector);
        }
    },

    selector: "",

    constructor: Query,

    context: null,

    length: 0,

    get: function (i) {
        i = i < 0 ? this.length + i : i;
        return this[i];
    },

    first: function () {
        return this.get(0);
    },

    last: function () {
        return this.get(-1);
    },

    each: function (callback) {
        return Query.each(this, callback);
    }
};

// 核心模块扩充功能； 
Query.extend = Query.fn.extend = function () {
    var args = [].slice.call(arguments),
        i = 0,
        target = args[i++],
        deep = false,
        source,
        src,
        copy,
        name,
        clone,
        isLikeArray;


    if (typeof target === "boolean") {
        deep = target;
        target = args[i++];
    }

    if (i === args.length) {
        target = this;
        i--;
    }

    for (; i < args.length; i++) {
        source = args[i];

        if (source !== undefined) {
            for (name in source) {
                src = target[name];
                copy = source[name];

                if (src === copy) {
                    continue;
                }

                if (deep && (isLikeArray = Query.isArray(copy) || Query.isPlainObject(copy))) {

                    if (isLikeArray) {
                        isLikeArray = false;
                        clone = Query.isArray(src) ? src : [];
                        target[name] = Query.extend(deep, clone, copy);
                    } else {
                        clone = src && Query.isPlainObject(src) ? src : {};
                        target[name] = Query.extend(deep, clone, copy);
                    }

                } else if (copy !== undefined) {
                    target[name] = copy;
                }
            }
        }
    }

    return target;
};

Query.extend({
    type: function (obj) {
        if (obj === null) {
            return obj + "";
        }

        return typeof obj === "object" || typeof obj === "function" ?
            class2type[toString.call(obj)] || "object" : typeof obj;
    },

    isPlainObject: function (obj) {
        if (Query.type(obj) !== "object" || obj.nodeType || Query.isWindow(obj)) {
            return false;
        }


        if (obj.constructor &&
            !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
            return false;
        }

        // If the function hasn't returned already, we're confident that
        // |obj| is a plain object, created by {} or constructed with new Object
        return true;
    },

    isFunction: function(obj) {
        return Query.type(obj) === "function";
    },

    isWindow: function (obj) {
        return obj && obj.window === window;
    },

    isLikeArray: function (obj) {
        var len = obj.length,
            type = Query.type(obj);

        if (type === "function" || Query.isWindow(obj)) {
            return false;
        }

        if (obj.nodeType === 1 && len) {
            return false;
        }

        return type === "array" || len === 0 || typeof len === "number" && len > 0 && [len - 1] in obj;
    },

    each: function (obj, callback, args) {
        var value,
            i = 0,
            isArray = Query.isLikeArray(obj),
            len = obj.length;

        if (args) {

            if (isArray) {

                for (; i < len; i++) {
                    value = callback.apply(obj[i], args);

                    if (value === false) {
                        break;
                    }
                }

            } else {

                for (i in obj) {
                    value = callback.apply(obj[i], args)

                    if (value === false) {
                        break;
                    }
                }
            }
        } else {

            if (isArray) {
                for (; i < len; i++) {
                    value = callback.call(obj[i], i, obj[i]);

                    if (value === false) {
                        break;
                    }
                }
            } else {
                for (i in obj) {
                    value = callback.call(obj[i], i, obj[i]);

                    if (value === false) {
                        break;
                    }
                }
            }

        }

        return obj;
    },

    inArray: function(item, list) {
        var idx = -1;
        Query.each(list, function(_, it) {
            if (it === item) {
                idx = _;
                return false;
            }
        });

        return idx;
    }
})

Query.each("Object Array String Boolean Number RegExp Date Function Error".split(" "), function (_, val) {
    class2type["[object " + val + "]"] = val.toLowerCase();
});
