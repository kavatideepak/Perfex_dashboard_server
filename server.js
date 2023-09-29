const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const employesData = require("./model/allemployees");
const employesworksheetFeedback = require("./model/worksheetandfeedback");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const middleware = require("./middleware/jwtAuth");

const app = express();
app.use(express.json());
app.use(cors());

const port = 7010;

mongoose
  .connect(
    "mongodb+srv://ajayjoji1723:Ajay123@cluster0.xs7ouo1.mongodb.net/pfxdashboard?retryWrites=true&w=majority"
  )
  .then((res) => console.log("DB Connected"))
  .catch((err) => console.log(err.message));

// adding new employee

app.post("/addEmployee", middleware, async (req, res) => {
  console.log(req.body);
  try {
    const user = await employesData.findOne({
      employeeId: req.body.employeeId,
    });

    if (!user) {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
      const newUser = {
        employeeName: req.body.employeeName,
        employeeId: req.body.employeeId,
        email: req.body.email,
        password: hashedPassword,
        employeeType: req.body.employeeType,
        phoneNumber: req.body.phoneNumber,
        designation: req.body.designation,
        aadharNumber: req.body.aadharNumber,
        joiningDate: req.body.joiningDate,
        trainingCourse: req.body.trainingCourse,
        trainerName: req.body.trainerName,
      };
      const userDetails = await employesData.create(newUser);
      res.status(200).send("employee created successfully");
    } else {
      res.status(402).json("employee already registered");
    }
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({ message: e.message });
  }
});


app.post("/addEmployeeWorkSheet", middleware, async (req, res) => {
  console.log(req.body);
  try {
    const user = await employesworksheetFeedback.findOne({
      employeeId: req.body.employeeId,
    });
   
    if (!user ) {
      const newUser = {
        employeeName: req.body.employeeName,
        employeeId: req.body.employeeId,
        email: req.body.email,
        employeeType:req.body.employeeType
      };
      const userDetails = await employesworksheetFeedback.create(newUser);
      res.status(200).send("employee created successfully");
    } else {
      res.status(402).json("employee already registered");
    }
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({ message: e.message });
  }
});


// hr credential api
// app.post("/admin-register", async(req,res)=>{
//     const {employeeId, password} = req.body
//     const hashedPassword = await bcrypt.hash(password, 10);

  

//     const newUser = {
//         employeeName: "Anil Naik",
//         employeeId: req.body.employeeId,
//         email: "anil@gmail.com",
//         password: hashedPassword,
//         employeeType: "Trainee",
//         phoneNumber: "9676091723",
//         designation: "Fullstack Developer",
//         aadharNumber: "984820001512",
//         joiningDate: "2023-07-17",
       
//       };

//     await employesData.create(newUser);
//    res.status(200).json("success")
    
    
// })



// LOGIN API

app.post("/login", async (req, res) => {
  try {
    const { employeeId, password } = req.body;
    const exist = await employesData.findOne({ employeeId });
    if (!exist) {
      return res.status(400).send("User Not Found");
    }

    const isPasswordMatched = await bcrypt.compare(password,exist.password)

    if(isPasswordMatched){
         // other than admin - ADMIN id : PX1001
    if (req.body.employeeId === "PX1001" ) {
        const empType = exist.employeeType;
        console.log("admin login successfull");
        let payload = {
          user: {
            employeeId: exist.employeeId
          },
        };
  
        jwt.sign(
          payload,
          "jwtPassword",
          { expiresIn: 360000000 },
          (err, token) => {
            if (err) throw err;
            return res.json({ token, empType });
          }
        );
      } else if (
        req.body.employeeId !== "PX1001" &&
        exist.employeeType === "Trainee" 
      ) {
        const empType = exist.employeeType;
        console.log("Trainee login successfull");
        let payload = {
          user: {
            employeeId: exist.employeeId,
          },
        };
  
        jwt.sign(
          payload,
          "jwtPassword",
          { expiresIn: 360000000 },
          (err, token) => {
            if (err) throw err;
            return res.json({ token, empType });
          }
        );
      } else if (
        req.body.employeeId !== "PX1001" &&
        exist.employeeType === "Trainer"
        
      ) {
        const empType = exist.employeeType;
        console.log("Trainer login successfull");
        let payload = {
          user: {
            employeeId: exist.employeeId,
          },
        };
  
        jwt.sign(
          payload,
          "jwtPassword",
          { expiresIn: 360000000 },
          (err, token) => {
            if (err) throw err;
            return res.json({ token, empType });
          }
        );
      }
    }else{
        return res.status(400).json({message: "Invalid Password"})
    }

    
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ data: "Server Error" });
  }
});





// get all api

app.get("/allemployees", middleware, async (req, res) => {
    console.log(req.employeeId) 
  const excludedEmployeeCriteria = {
    $or: [
      { employeeType: { $ne: "Admin" } },
      { employeeId: { $ne: "PX1001" } },
    ],
  };

  const allUsers = await employesData.find(excludedEmployeeCriteria);
  allUsers.forEach((user) => {
    user.weeklyFeedbackByHR.reverse();
  });
  res.status(200).send(allUsers);
});





// PUT APPI - updating employee details in Database

app.put("/employee/:employeeId",middleware, async (req, res) => {
  try {
    const { employeeId } = req.params;
    console.log(employeeId);
    const { employeeName, email, password, employeeType,phoneNumber,designation,aadharNumber,joiningDate,trainingCourse,trainerName, weeklyFeedbackByHR } = req.body;
    const filter = { employeeId : employeeId };
    const update = {
      employeeName: employeeName,
      email: email,
      password: password,
      employeeType:employeeType,
      phoneNumber:phoneNumber,
      designation:designation,
      aadharNumber:aadharNumber,
      joiningDate:joiningDate,
      trainingCourse:trainingCourse,
      trainerName:trainerName,
      weeklyFeedbackByHR:weeklyFeedbackByHR

    };
    const user = await employesData.findOneAndUpdate(filter, update, { new: true });

    if (!user) {
      return res.status(400).json("employee not found");
    }

    console.log("Updated details of employee:", user);
    res.status(200).json("Employee details updated successfully");
  } catch (error) {
    console.error("Error updating employee:", error);
    res.status(500).json("An error occurred while updating employee");
  }
});





// emplpoyee feedback and work status weekly
app.put("/employeefeedback/:employeeId", middleware, async (req, res) => {
  try {
    const { employeeId } = req.params;
    console.log(employeeId);
    const { weekperiod } = req.body;
    const filter = { employeeId : employeeId };
    const update = {
      weekperiod: weekperiod
    };
    const user = await employesworksheetFeedback.findOneAndUpdate(filter, update, { new: true });

    if (!user) {
      return res.status(400).json("employee not found");
    }

    console.log("Updated details of employee:", user);
    res.status(200).json("Employee details updated successfully");
  } catch (error) {
    console.error("Error updating employee:", error);
    res.status(500).json("An error occurred while updating employee");
  }
});





// getting individual employee
app.get("/individualEmployee/", middleware,  async (req, res) => {
  const {employeeId} = req.employeeId;
  // console.log(employeeId)
  const user = await employesData.findOne({employeeId:employeeId})
  if (!user) {
    res.status(400).json("user not found");
  }
    user.weeklyFeedbackByHR.reverse();
  res.status(200).send(user)
})



//  getting individual employee worksheet
app.get("/individualEmployeeTimesheet/:id", middleware,  async (req, res) => {
  const { id } = req.params
  const user = await employesworksheetFeedback.findOne({employeeId:id})
  if (!user) {
    res.status(400).json("user not found");
  }
  user.weekperiod.reverse();
  res.status(200).send(user)
})




app.listen(port, () => {
  console.log(`server running at ${port} `);
});
