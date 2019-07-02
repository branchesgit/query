var rnotwhite = /\S+/g;

function createOption(options) {
    var option = {};

    Query.each(options.match(rnotwhite) || [], function (_, val) {
        option[val] = true;
    });

    return option;
}

// 执行函数队列；
Query.Callbacks = function (options) {
    options = Query.type(options) === "string" ?
        createOption(options) :
        Query.extend({}, options);


    var firing,

        memory,

        fired,

        locked,

        list = [],

        queue = [],

        firingIndex = -1,

        fire = function () {

            locked = options.once;

            fired = firing = true;

            for (; queue.length; firingIndex = -1) {
                memory = queue.shift();

                while (++firingIndex < list.length) {
                    if (list[firingIndex].apply(memory[0], memory[1]) === false &&
                        options.stopOnFalse) {

                        // Jump to end and forget the data so .add doesn't re-fire
                        firingIndex = list.length;
                        memory = false;
                    }
                }
            }

            // Forget the data if we're done with it
            if (!options.memory) {
                memory = false;
            }

            firing = false;

            // Clean up if we're done firing for good
            if (locked) {

                // Keep an empty list if we have data for future add calls
                if (memory) {
                    list = [];

                    // Otherwise, this object is spent
                } else {
                    list = "";
                }
            }

        },

        self = {
            add: function () {

                if (list) {
                    (function add(args) {
                        Query.each(args, function (_, arg) {

                            if (Query.isFunction(arg)) {

                                if (!options.unique || !options.has(arg)) {
                                    list.push(arg);
                                }

                            } else if (Query.isArray(arg)) {
                                add(arg);
                            }
                        });

                    })(arguments);

                    if (memory && !firing) {
                        fire();
                    }
                }

                return list;
            },

            remove: function () {
                (function remove(args) {
                    Query.each(args, function (_, arg) {
                        if (Query.isFunction(arg)) {
                            var index;

                            if ((index = Query.inArray(item, list)) > -1) {
                                list.splice(index, 1);

                                firingIndex--;
                            }

                        } else if (Query.isArray(arg)) {
                            remove(arg);
                        }
                    });

                })(arguments)
            },

            has: function (callback) {
                var has = false;

                if (list) {
                    Query.each(list, function (_, fn) {
                        if (fn === callback) {
                            has = true;
                            return false;
                        }
                    })
                }

                return has;
            },

            empty: function () {
                if (list) {
                    list = [];
                }

                return this;
            },

            disabled: function () {
                return !list;
            },

            disable: function () {
                locked = queue = [];
                list = memory = "";
                return this;
            },

            fireWith: function (context, args) {
                if (!locked) {
                    args = args || [];
                    args = [context, args.slice ? args.slice() : args];
                    queue.push(args);

                    if (!firing) {
                        fire();
                    }
                }
                return this;
            },

            fire: function () {
                self.fireWith(this, arguments);
                return this;
            },

            lock: function () {
                locked = queue = [];
                if (!memory) {
                    list = memory = "";
                }
                return this;
            },

            locked: function () {
                return !!locked;
            }
        };


    return self;
};