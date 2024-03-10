// Task1: initiate app and run server at 3000
const { json } = require("body-parser");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const PORT = 5000;
const bodyParser = require("body-parser");
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use(express.static(path.join(__dirname + "/dist/FrontEnd")));
app.use("/api/employeelist", express.urlencoded({ extended: true }));

// Task2: create mongoDB connection
mongoose.connect(
  "mongodb+srv://JudeClement:iwitness@cluster0.maj72ra.mongodb.net/employeeDB",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
const employeeSchema = new mongoose.Schema({
  name: String,
  location: String,
  position: String,
  salary: Number,
});
const Employee = mongoose.model("Employee", employeeSchema);

//Task 2 : write api with error handling and appropriate api mentioned in the TODO below

//TODO: get data from db  using api '/api/employeelist'

app.get("/api/employeelist", async (req, res) => {
  try {
    const employees = await Employee.find();
    res.send(employees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

//TODO: get single data from db  using api '/api/employeelist/:id'

app.get("/api/employeelist/:id", async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }
    res.json(employee);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

//TODO: send data from db using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}

app.post("/api/employeelist",bodyParser.json(), async (req, res) => {
  try {
    const { name, location, position, salary } = req.body;
    const salaryNumber = parseFloat(salary);

    const newEmployee = new Employee({
      name,
      location,
      position,
      salary: salaryNumber,
    });

    await newEmployee.save();

    res.status(201).json(newEmployee);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

//TODO: delete a employee data from db by using api '/api/employeelist/:id'

app.delete("/api/employeelist/:id", async (req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
    if (!deletedEmployee) {
      return res.status(404).json({ error: "Employee not found" });
    }
    res.json({ message: "Employee deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

//TODO: Update  a employee data from db by using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}

app.put("/api/employeelist",bodyParser.json(), async (req, res) => {
  try {
    const { name, location, position, salary } = req.body;

    if (!name || !location || !position || !salary) {
      return res
        .status(400)
        .json({
          error: "All fields (name, location, position, salary) are required",
        });
    }

    const salaryNumber = parseFloat(salary);

    const updatedEmployee = await Employee.findOneAndUpdate(
      { name: name },
      { location, position, salary: salaryNumber },
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.json(updatedEmployee);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

//! dont delete this code. it connects the front end file.
app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname + "/dist/Frontend/index.html"));
});