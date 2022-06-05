const jwt = require('jsonwebtoken');
const config = require('config');


module.exports = function(req, res, next){ //exporting this middleware function
    //Get token from header
    const token = req.header('x-auth-token');

    //check if no token
    if(!token){
        return res.status(401).json({ msg: 'No token, authorization denied'});
    }
    //verify token
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret')); 
        //note: we attached the userid in const payload.
        req.user = decoded.user; // set req.user to the user that's in the decoded token
        next(); // all middleware has this function
    } catch (err) {
        res.status(401).json( { msg: 'Token is not valid' });
    }
}