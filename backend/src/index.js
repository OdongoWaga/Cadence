const cookieParser = require('cookie-parser');
require('dotenv').config({ path: 'variables.env'});
const createServer = require('./createServer');
const db = require('./db');
const jwt= require('jsonwebtoken');

const server = createServer();

server.express.use(cookieParser());

//decode JWT to get user on each request
server.express.use((req, res, next)=> {
    const {token} = req.cookies;
    if(token) {
        const {userId} =jwt.verify(token, process.env.APP_SECRET);
// put the userId onto the req for future requests to access

req.userId= userId;
    }
    next();
});

//2. Create a middleware that populates the user on each request
 
server.express.use(async (req, res, next)=> {
    // if they aren't logged in skip this
    if(!req.userId) return next();

    const user = await db.query.user(
        {where: {id: req.userId}},
        '{id, permissions, email, name}'
    );
    req.user= user;
    next();
})

//To do list use express middleware to handle cookies(JWT)



//Todo Use express middleware to populate current user

server.start({
    cors:{
        credentials: true,
        origin: process.env.FRONTEND_URL,
    },
}, deets=> {
    console.log(`Server is now running on port http:/localhost: ${deets.port}`);
})