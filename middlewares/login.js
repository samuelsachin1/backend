const express=require('express')
const router=express.Router()
const registration=require('../models/registration')
const employee=require('../models/employee')
//const authenticate=require('../middlewares/authenticate')
// const checkrole=require('../middlewares/checkuser')
const adminmodel=require('../models/admin')
const bcrypt=require('bcrypt')
const jwt = require('jsonwebtoken');
const nodemailer=require('nodemailer');

// router.post('/login', async (req, res, next) => {
//     const email = req.body.email
//     const password = req.body.password
//     const role = req.body.userType
//     console.log(password,email,role)
  
//     try {
//     let existingUser
//       if(role==='user'){
//       existingUser = await registration.findOne({ email:email });
//       }
//       else if(role==='employee')
//       {
//         existingUser = await employee.findOne({ email:email });
//       }
//       else
//       {
//         existingUser = await adminmodel.findOne({ email:email });
//       }
//       //console.log()
//       //boolean temp= bcrypt.compare(password, existingUser.password)
  
//       if (!existingUser||!await bcrypt.compare(password,existingUser.password)) {
//         return res.status(401).json({ success:false,message: 'Invalid email or password' });
//       }
  
//       // Generate a JWT token
//       const token = jwt.sign({email}, 'your-secret-key', { expiresIn: '5s' });
//       existingUser.token=token
//       await existingUser.save()
//       res.status(200).json({ role:role,token,success:true });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ success:false,message: 'Internal Server Error' });
//     }
//   });
//   router.post('/forgot-password', async (req, res, next) => {
//     const email = req.body.email
//     const role = req.body.userType
//     console.log(email,role)
  
//     try {
//     let existingUser
//       if(role==='user'){
//       existingUser = await registration.findOne({ email:email });
//       }
//       else if(role==='employee')
//       {
//         existingUser = await employee.findOne({ email:email });
//       }
//       if (!existingUser) {
//         return res.status(401).json({ success:false,message: 'Invalid email or password' });
//       }
//       //const secret=existingUser.password;
//       // Generate a JWT token
//       const token = jwt.sign({id: existingUser._id},'your-secret-key', { expiresIn: '5m' });
      
//       const transporter=nodemailer.createTransport(
//         {
//             service:'gmail',
//             auth:
//             {
//                 user:'yvishnuvamsith@gmail.com',
//                 pass:'mdpn lifx vbso swlp'
//             }
//           }
//           );
//           var mailOptions = {
//             from: 'yvishnuvamsith@gmail.com',
//             to: email,
//             subject: 'Reset Your Password ',
//             text: `http://localhost:3000/reset-password/${existingUser._id}/${token}`
//           };
          
//           transporter.sendMail(mailOptions, function(error, info){
//             if (error) {
//               console.log(error);
//             } else {
//               res.send({status:"success"});
//             }
//           });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ success:false,message: 'Internal Server Error' });
//     }
//   });

router.post('/login', async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const role = req.body.userType;
  console.log(password, email, role);

  try {
    let existingUser;
    if (role === 'user') {
      existingUser = await registration.findOne({ email: email });
    } else if (role === 'employee') {
      existingUser = await employee.findOne({ email: email });
    } else {
      existingUser = await adminmodel.findOne({ email: email });
    }

    if (!existingUser || !(await bcrypt.compare(password, existingUser.password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    let expiresIn = '1h'; // Default expiration for non-admin users
    if (role === 'admin') {
      expiresIn = '30d'; // Set expiresIn to a value that indicates it never expires
    }

    // Generate a JWT token
    const token = jwt.sign({ email, role }, 'your-secret-key', { expiresIn });
    existingUser.token = token;
    await existingUser.save();

    res.status(200).json({ role: role, token, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

  
  router.post('/reset-password/:id/:token', async (req, res, next) => {
    console.log("hi");
    const { id, token } = req.params;
    const password = req.body.password;
    const role = req.body.userType;
    console.log(password, role);

    try {
        jwt.verify(token, 'your-secret-key', async (err, decoded) => {
            if (err) {
                console.log(err);
                return res.json({ Status: "Error with Token" });
            } else {
                try {
                    const hash = await bcrypt.hash(password, 10);
                    if (role === 'user') {
                        await registration.findByIdAndUpdate(id, { password: hash });
                        console.log("Password updated successfully for user:", id);
                    } else {
                        await employee.findByIdAndUpdate(id, { password: hash });
                        console.log("Password updated successfully for employee:", id);
                    }
                    res.json({ success: true, message: 'Password updated successfully' });
                } catch (error) {
                    console.error("Error updating password:", error);
                    res.status(500).json({ success: false, message: 'Error updating password' });
                }
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});



  module.exports=router