Query.extend({
    Deffered:  function (func) {
        var tuples = [
            ["resolve", "done", Query.Callbacks("once memory"), "resolved"],
            ["reject", "fail", Query.Callbacks("once memory"), "rejected"],
            [ "notify", "progress", Query.Callbacks( "memory" ) ]
        ];

        var state = "pending",
            promise = {
                state: function () {
                    return state;
                },

                always: function (func) {
                    deffered.done(func).fail(func);
                    return this;
                },

                // 返回的可以then
                then: function (/** fnDone, fnFail, fnNotify **/) {
                    var fns = Array.prototype.slice.call(arguments);

                    return Query.Deffered(function(newDefer){

                        Query.each(tuples, function(_, tuple){
                            var fn = Query.isFunction(fns[_]) && fns[_];

                            // 将回调推进去到可执行函数集合里面去；
                            deffered[tuple[1]](function(){ 
                                var returned = fn && fn.apply(this, arguments);

                                if (returned && Query.isFunction(returned.promise)) {
                                    returned.promise()
                                        .progress(newDefer.notify)
                                        .done(newDefer.resolve)
                                        .fail(newDefer.reject);

                                } else {
                                    newDefer[tuple[0] + "With"](
                                        this === promise ? newDefer.promise() : this,
                                        fn ? [returned] : arguments
                                    )
                                }
                            });
                        });

                    }).promise;
                },

                promise: function (obj) {
                    return obj != null ? Query.extend(obj, promise) : promise;
                }
            },

            deffered = {};

        Query.each(tuples, function (i, tuple) {
            var list = tuple[2],
                strState = tuple[3];

            promise[tuple[1]] = list.add;

            if (strState) {
                list.add(function () {
                    state = strState;
                }, tuples[i ^ 1][2].disable, tuples[2][2].lock);
            }

            deffered[tuple[0]] = function () {
                deffered[tuple[0] + "With"](this === deffered ? promise : this, arguments)
                return this;
            };

            deffered[tuple[0] + "With"] = list.fireWith;
        });


        promise.promise(deffered);

        if (func) {
            func.call(deffered, deffered);
        }

        return deffered;
    },

    when: function() {

    }
});