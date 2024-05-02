const express = require("express");
const router = express.Router();
const User = require("../models/User");
const formidable = require("formidable");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const multer = require('multer');
const path = require('path');


router.post("/fetchUserData", async (req, res) => {
  const userId = req.body.userId;
  const user = await User.findById(userId);
  res.status(200).json({ user: user });
});

router.get("/getUserDetails/:id", async (req, res) => {
  const user_id = req.params.id;
  try {
    const user = await User.findById(user_id).select('-password'); 
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ userData: user, message: "ok" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "error", error: "Internal Server Error" });
  }
});

router.patch('/updateuser/:id', async (req, res) => {
  console.log("here its ",req.body)
    try {
        const user_id = req.params.id;
        const {fullName, password, contact, DOB, address, email} = req.body;
        console.log("editbody",req.body);

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const updateUser = await User.findOneAndUpdate({_id:user_id}, { fullName, password:hashedPassword, contact, DOB, address, email }, { upsert: true })
        if (updateUser.nModified === 0) {
            return res.status(404).json({ error: "User Details failed to update!" });
        }
        return res.status(201).json({ updateUser, message: "ok" });
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
})


//lost and found
const storage = multer.diskStorage({
  destination: 'profilePic/', 
  filename: function (req, file, cb) {
    cb(null,Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

router.post('/imageUpload/:userId', upload.single('userImg'), async (req, res) => {
  const {userId} = req.params;
  try {

    const imageUrl = req.file.path;
    const imgName = req.file.originalname;

    const updateUser = await User.findOneAndUpdate({_id:userId}, { imageUrl: imageUrl}, { upsert: true })

    if(updateUser){
      res.status(201).json({ message: "ok", imageUrl:imageUrl});
    }
    else{
      res.status(500).json({ message: 'Failed To upload' });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
