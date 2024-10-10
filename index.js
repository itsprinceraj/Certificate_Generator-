// ------------------------ Initial setup & importing the modules --------------------------------
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

//------------------------- Initializing the express ---------------------------------------------
const app = express();

//---------- To parse the incoming data(from frontend) into json format --------------------------
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//-----------------------------mongodb database code-----------------------------------------------
//1).-----------connecting node with mongodb----------------
mongoose
  .connect("mongodb://localhost:27017/UniversityDatabase")
  .then(() => console.log("DB connected Successfully"))
  .catch((err) => {
    console.log("Db connection error", err);
    process.exit(1);
  });

//2).-----------making schema in mongodb--------------------
const studentSchema = mongoose.Schema({
  Name: String,
  rollNo: { type: String, unique: true },
  registrationNo: { type: String, unique: true },
  course: String,
  branch: String,
  YearOfAdmission: Number,
  YearOfGraduation: Number,
});
const adminSchema = mongoose.Schema({
  username: String,
  password: Number,
});

//3).------------making model in mongodb-----------------------
const Student = mongoose.model("Students", studentSchema);
const Admin = mongoose.model("Admins", adminSchema);

// ---------------------------Setting view engine to hbs------------------------------------------
app.set("view engine", "hbs");
app.use(express.static("./public"));

//----------------------------This code created the admins----------------------------------------
// app.get("/create",async function(req,res){
//     const user = await Admin.create({
//         username:"Chhaya",
//         password:123456
//     });
// })

//---------------------------Get request for home page---------------------------------------------
app.get("/", function (req, res) {
  res.render("index");
});

//-----------------------Post request from login form (handle login form data)----------------------
app.post("/", async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  try {
    const AdminFound = await Admin.findOne({ username: username });
    if (!AdminFound) {
      return res.json({ error: "incorrect_username" });
    }
    if (AdminFound.password != password) {
      return res.json({ error: "incorrect_password" });
    }
    return res.json({ success: true });
  } catch (error) {
    console.log("Internal server error");
    return res.status(500).json({ error: "internal_server_error" });
  }
});

app.post("/searchStudent", async function (req, res) {
  try {
    const StudentFound = await Student.findOne({
      registrationNo: req.body.registrationNo,
    });
    if (!StudentFound) {
      return res.json({ error: "incorrect_registration_no" });
    }
    return res.json({ success: true, StudentFound });
  } catch (error) {
    console.log("Internal server error");
    return res.status(500).json({ error: "internal_server_error" });
  }
});

app.post("/addStudent", async function (req, res) {
  try {
    const createdStudent = await Student.create({
      Name: req.body.Name,
      rollNo: req.body.rollNo,
      registrationNo: req.body.registrationNo,
      course: req.body.course,
      branch: req.body.branch,
      YearOfAdmission: req.body.YearOfAdmission,
      YearOfGraduation: req.body.YearOfGraduation,
    });
    if (createdStudent) {
      return res.json({ success: true });
    }
    throw new Error("Failed to create student");
  } catch (error) {
    if (error.code == 11000 && error.keyPattern && error.keyPattern.rollNo) {
      // Roll number already exists
      return res.json({ success: false, error: "rollNo_exists" });
    } else if (
      error.code == 11000 &&
      error.keyPattern &&
      error.keyPattern.registrationNo
    ) {
      // Registration number already exists
      return res.json({ success: false, error: "registrationNo_exists" });
    } else {
      // Other internal server error
      console.error("Internal server error:", error);
      return res
        .status(500)
        .json({ success: false, error: "internal_server_error" });
    }
  }
});

//-------------------------Server listening http requests from client side at given port------------------------------
app.listen(5000, () => console.log("app is running on port 5000"));
