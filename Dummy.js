exports = module.exports = function dummy(root, options){
    
    return function dummy(req, res, next) {
 
        return next();
        
    };
};