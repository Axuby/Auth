// const express = require("express");
// const jwt = require("jsonwebtoken");

// exports.signUp = (async (req, res, next) => {
//   //const newUser =  await new User.create(req.body)
//   const newUser = await new User.create({
//     name: req.body.name,
//     email: req.body.email,
//     password: req.body.password,
//     confirmPassword: req.body.confirmPassword
//   });

//   const token = jwt.sign({ id: newUser._id,
//  email: newUser.email
//}
//, "secret", { expiresIn: "10d" });

//   res.status(200).json({
//     status: "success",
//     token,
//     Data: {
//       user: newUser
//     }
//   });
// });

// exports.logging = (req,res,next) =>{
// const {email,password } = req.body

// if(!password||!email){
// return function(err,statusCode){
// console.log("please input password and email", statusCode);
// }

// }
// }

const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const userRouter = require("./routes/userRoutes");
const URL = " mongodb://127.0.0.1:27017/Auth&Register";

mongoose.Promise = global.Promise;

mongoose
  .connect(URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(
    () => {
      console.log("Connected to mongoDB");
    },
    err => console.log("Error connecting to mongoDB", err)
  );

const app = express();
const port = process.env.PORT || 3600;

//sets up the middleware for parsing the bodies and cookies off of the requests
app.use(express.json());
app.use(cookieParser());

app.use("/api/users", userRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = { app };
