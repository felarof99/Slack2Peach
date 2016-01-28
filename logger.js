module.exports = {
    debug: true,
    log: function(){
        if(this.debug) {
            for (var i = 0; i < arguments.length; i++) {
                console.log(arguments[i]);
            }
        }
    },
    err: function(msg, obj){
        if(obj == null) obj = {};
        if(this.debug){
            console.error( "Error: " + msg);
            console.error(obj);
        }
    },
}