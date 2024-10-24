// const allowedOrigins = require("./allowedOrigins");   //because origins ha tegy from allowedOrigins
// const corsOptions = {
//     origin: (origin,callback)=>{
//        if(allowedOrigins.indexOf(origin) !== -1 || !origin){  //|| !origin to test in postman because postman no domain but in production only (remove || !origin)  
//             callback(null,true)  //null no error and true value of origin
//        }else {
//             callback(new Error("Not allowed by CORS"))   //server not allow this domain to access because this domain dont add in array ib allowedOrigins.js file
//        }
//     },
//     credentials: true, // to receive all data send with request in header and body or any cookies
//     optionsSuccessStatus: 200
// };


// module.exports = corsOptions;