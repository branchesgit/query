(function(Q){
    function Data() {
        Object.defineProperty(this.cache = {}, 0, {
            get: function() {
                return {};
            }
        });

        this.expando = Q.expando + Data.uid++;
    }

    Data.uid = 1;

    Data.accepts = function(owner) {
        return owner.nodeType === 1 || owner.nodeType === 9;
    };

    Data.prototype = {
        key: function( owner ) {
            
            if (!Data.accepts(owner)) {
                return 0;
            }

            var descriptor = {},
                unlock = owner[this.expando];

            if (!unlock) {
                unlock = Data.uid++;

                try {
                    descriptor[this.expando] = {value: unlock};
                    Object.defineProperties(owner, descriptor);
                } catch(e) {
                    descriptor[this.expando] = {value: unlock};
                    Query.extend(owner, descriptor);
                }
                
            }

            // 
            if (!this.cache[unlock]) {
                this.cache[unlock] = {};
            }

            return unlock;
        },
        
        set: function(owner, data, value) {
            var prop, 
                unlock = this.key(owner),
                cache = this.cache[unlock];

            if (typeof data === "string") {
                cache[data] = value;
            
            } else {
                if (Q.isEmptyObject(cache)) {
                    Q.extend(cahce, data);
                } else {
                    for (prop in data) {
                        cache[prop] = data[prop];
                    }
                }
            }

            return cache;
        },

        get: function(owner, key) {
            var cache = this.cache[this.key(owner)];
            return key === undefined ? cache : cache[key];
        },

        
    };

    Query.Data = Data;
})(Query);