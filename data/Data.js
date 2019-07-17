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
        }
    };

    Query.Data = Data;
})(Query);