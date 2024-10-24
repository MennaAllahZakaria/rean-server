const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const path = require("path");
const cors = require('cors');
const cookieParser = require("cookie-parser"); 
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');
const PORT = process.env.PORT || 5000;


// Load environment variables from .env file
dotenv.config();


app.use(cors({
    origin: '*'
  }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

// Middleware for parsing JSON requests
app.use(express.json());
app.use('/api/purchases', purchaseRoutes);
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);


//handel error when any path dont found in my app
app.all("*",(req,res) => { //all for any routes me4 3andy display error
  res.status(404);
  if(req.accepts("html")){  //if req support html (open from browser)
      res.sendFile(path.join(__dirname,"views","404.html"));
  }else if(req.accepts("json")){  //if req support json
      res.json({msg: "404 Not Found"});
  }else {
      res.type("txt").send("404 Not Found");  //if mobile
  }
});

// Connect to MongoDB
mongoose
.connect(process.env.MONGO_URI)
.then(() => {
    console.log("Connectd DataBase Successfuly");
    app.listen(PORT,() => {
        console.log(`Server running on port ${PORT}`);
    });
})
.catch((err) => {
    console.log({msg: err});
});
