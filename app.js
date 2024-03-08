const express = require('express');
const functions = require('firebase-functions')
// const mongoose = require('mongoose');
const multer = require('multer');
const admin = require('firebase-admin');
const axios = require('axios');
const BASE_URL = 'https://graph.facebook.com/v18.0';
require("dotenv").config()
const cors=require('cors')
const ACCESS_TOKEN = 'EAAVZAZAgRESPEBOwZCafUrCD77PaXWdXnVtnZBP4NLeDYQbwAZB8As4udUYU6hf2Ut8Q8AaEmwispSUqEZCP9RkBRM08TRHv1RM4u760qZCDbJnTn6ZAAdxVZCLpR0OboTY3sgOnTTzh8seJPsljJ1AAncQfTeIhjormj03KSXneYaBBfyKrAitpOBpI8QUjmv2PXtZBOTEVzWmLZAFkyjH1pTSzh3pUogZD';
const serviceAccount = require('./privatekey.json'); // Replace with your Firebase service account key
const user=require('./routes/UserCrud')
const employee=require('./routes/employeecrud')
const admincrud=require('./routes/admincrud')
const login=require('./middlewares/login')
const companycrud  = require('./routes/UserCompany')
const pay = require('./routes/payment')
const payment = require('./middlewares/paymenthistory')
const token = require('./routes/checktoken')


const { MongoClient, GridFSBucket } = require('mongodb');
// const mongoose = require('./Config/Connection')

const app = express();
const PORT = 5000
// app.use(express.json())
app.use(express.json({ limit: '50mb' }));

app.use(cors())

const storage = multer.memoryStorage(); // Store files in memory as buffers
const upload = multer({ storage: storage });



app.use('/login',login)
app.use('/user',user)
app.use('/employee',employee)
app.use('/admin',admincrud)
app.use('/company',companycrud)
app.use('/payment',payment)
app.use('/pay',pay)
app.use('/token',token)
app.post('/send-message', async (req, res) => {
  try {
    const { to, message } = req.body;

    const sendMessageUrl = `${BASE_URL}/158030817403730/messages`;

    const response = await axios.post(sendMessageUrl, {
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: message },
    }, {
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    // Handle the response as needed
    console.log(response.data);

    res.json({ success: true, message: 'Message sent successfully' });
  }catch (error) {
    console.error('Error sending message:', error.response.data);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});
// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     storageBucket: 'gs://test-caf7b.appspot.com', // Replace with your Firebase Storage bucket URL
//   });
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });
// app.post('/api/upload', upload.single('file'), async (req, res) => {
//     try {
//       // File is uploaded to Firebase Storage
//       const bucket = admin.storage().bucket();
//       const file = bucket.file(req.file.originalname);
  
//       // Upload the file to Firebase Storage
//       await file.save(req.file.buffer, {
//         metadata: {
//           contentType: req.file.mimetype,
//         },
//       });
  
//       // Get the public URL of the uploaded file
//       const fileUrl = https://storage.googleapis.com/${bucket.name}/${file.name};
//       console.log('File uploaded to Firebase Storage:', fileUrl);
  
//       // You can save the file URL or other relevant information in MongoDB
//       // Example: save the file URL in MongoDB
//       // const document = new Document({ fileUrl });
//       // document.save();
  
//       res.json({ message: 'File uploaded successfully.', fileUrl });
//     } catch (error) {
//       console.error('Error uploading file:', error.message);
//       res.status(500).json({ message: 'Internal Server Error' });
//     }
//   });
  // app.get('/api/retrieve/:fileName', async (req, res) => {
  //   try {
  //     const { fileName } = req.params;
  //     //const decodedFileName = decodeURIComponent(fileName);
  
  //     // Get the file from Firebase Storage
  //     const bucket = admin.storage().bucket();
  //     const file = bucket.file(fileName);
  
  //     // Check if the file exists
  //     const [exists] = await file.exists();
  //     if (!exists) {
  //       return res.status(404).json({ message: 'File not found' });
  //     }
  
  //     // Generate a download URL for the file
  //     const downloadUrl = await file.getSignedUrl({
  //       action: 'read',
  //       expires: '03-01-2500', // Set an expiration date if needed
  //     });
  
  //     res.json({ message: 'File retrieved successfully.', downloadUrl });
  //   } catch (error) {
  //     console.error('Error retrieving file:', error.message);
  //     res.status(500).json({ message: 'Internal Server Error' });
  //   }
  // });
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });

  exports.api = functions.https.onRequest(app)