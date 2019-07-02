(function () {

    var ref = function (value) {
        if (value && value.then) {
            return value;
        }

        return {
            then: function (callback) {
                return ref(callback(value));
            }
        }
    };

    var deffered = function () {
        var list = [],
            value,

            promise = {
                then: function (_callback) {
                    var returned = deffered();

                    var callback = function (_value) {
                        returned.resolve(_callback(_value));
                    };

                    if (list) {
                        list.push(callback);
                    } else {
                        value.then(callback);
                    }

                    return returned;
                }
            };


        return {
            promise: promise,
            resolve: function (_value) {

                if (list) {
                    value = ref(_value);

                    for (var i = 0, len = list.length; i < len; i++) {
                        value.then(list[i]);
                    }
                }
            },

            then: promise.then
        };
    };
})();
