module.exports = {
    debug: true,
    log: function(msg, obj){
        if(obj == null) obj = {};
        if(this.debug){
            console.log(msg);
            console.log(obj);
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