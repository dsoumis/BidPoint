const jwt = require('jsonwebtoken');
module.exports = {
    user:
        function auth(request, response, next)
        {
            const token = request.cookies.token;
            if (!token) return response.status(401).json('Unauthorized: No token provided');

            try {
                request.user = jwt.verify(token, process.env.TOKEN_SECRET); //Verified user, returns _id
                next();
            } catch (error) {
                response.status(400).json('Invalid Token');
            }
        },
    admin:
        function authAdmin(request,response,next) {
            const token = request.cookies.adminToken;
            if(!token) return response.status(401).json('Unauthorized: No token provided');

            try{
                request.user= jwt.verify(token, process.env.TOKEN_SECRET); //Verified user, returns _id
                next();
            }catch (error) {
                response.status(400).json('Invalid Token');
            }
        }
};
