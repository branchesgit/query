var
    document = window.document,

    Query = function(selector, context) {
        return new Query.fn.init(selecotr, context);
    },

    hasOwn = Object.prototype.hasOwnProperty,

    toString = Object.prototype.toString;

class2type = {};




Query.fn = Query.prototype = {

    init: function(selector, context) {

    },

    selector: "",

    constructor: Query,

    length: 0,

    map: function(callback) {

    },

    get: function(i) {

    },

    first: function() {
        return this.get(0);
    },

    last: function() {
        return this.get(-1);
    }
};

// 核心模块扩充功能； 
Query.extend = Query.fn.extend = function() {
    var args = [].slice.call(arguments),
        i = 0,
        target = args[i++],
        deep = false,
        source, options,
        src, copy,
        name, clone,
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
        var source = args[i];

        for (name in source) {
            src = target[name];
            copy = source[name];

            if (src === copy) {
                continue;
            }

            if (deep && (isLikeArray = Query.isLikeArray(copy) || Query.isPlainObject(copy))) {

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

    return target;
};


Query.extend({
    type: function(obj) {
        if (obj === null) {
            return obj + "";
        }

        return typeof obj === "object" || typeof obj === "function" ?
            class2type[toString.call(obj)] || "object" : typeof obj;
    },

    isPlainObject: function(obj) {
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

    isWindow: function(obj) {
        return obj && obj.window === window;
    },

    isLikeArray: function(obj) {
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

    each: function(obj, callback, args) {
    	var value, i = 0
    		isArray = Query.isLikeArray(obj);

        if (args) {
            
            if (isArray) {
                
                for (len = obj.length; i < len; i++) {
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
        		for (len = obj.length; i < len; i++) {
        			value = callback.call(obj[i], i, obj[i]);

        			if (value === false) {
        				break;
        			}
        		}
        	} else {
        		for (name in obj) {
        			value = callback.call(obj[i], i, obj[i]);

        			if (value === false) {
        				break;
        			}
        		}
        	}

        }

        return obj;
    }
})

Query.each("Object Array String Boolean Number RegExp Date Function Error".split(" "), function(_, val) {
    class2type["[object " + val + "]"] = val.toLowerCase();
});

console.log(class2type);
