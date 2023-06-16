const router = require('express').Router();
const {PrismaClient} = require('@prisma/client')

const prisma = new PrismaClient()

router.post('/createUser', async (req, res, next) => {
  try {
    if(req.body.phoneNumber.length!=8 ) {
      res.send({message: 'Phone Number should be 8 digits'})
    }
    const user = await prisma.user.create({
      data:req.body
    })
    console.log(user)
    res.sendStatus(200)
  } catch(error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const phoneNumber= req.body.phoneNumber
    // console.log(phoneNumber)
    const user = await prisma.user.findUnique({
      where: {
        phoneNumber: phoneNumber,
      },
      include: {generatedOTP: true}
    })
    console.log("ERROR1")
    const password = req.body.password
    if(user!=null) {
      // console.log("ERROR2")
      if(password==user.password) {
        const OTPnumber = Math.floor(Math.random()*1000000-1)
        console.log(OTPnumber)
        //checks if alr has existing which might be expired 
        //when user regenerates even if not expired 
        if(user.generatedOTP!=null) {
          await prisma.generatedOTP.delete({
            where: {
              userPhoneNumber: phoneNumber, 
            }
          })
        }
        const otp = await prisma.generatedOTP.create({
          data: {
            otp: OTPnumber,
            userPhoneNumber: phoneNumber,
          }
        })
        console.log(otp)
        res.json(OTPnumber)
      } else {
        res.send({message: "Wrong password."})
      }
    } else {
      res.send({message: "User not found. Wrong phone number"})
    }
  } catch(error) {
    console.log(error)
    next(error);
  }
});

router.post('/validate', async (req, res, next) => {
  try {
    const phoneNumber= req.body.phoneNumber
    const user = await prisma.user.findUnique({
      where: {
        phoneNumber: phoneNumber,
      },
      include: {generatedOTP: true}
    })
    if(user!=null) {
      otpReceived = req.body.otp
      const otpEntity = user.generatedOTP
      const now = new Date()
      if(otpEntity.otp==otpReceived && Math.abs(otpEntity.dateCreated-now.getTime())<60) {
        res.sendStatus(200)
      } else {
        res.send({message: "OTP has expired. Please log in again to regenerate an OTP"})
      }
    } else {
      res.send({message: "User not found. Wrong phone number."})
    }
    
  } catch(error) {
    console.log(error)
    next(error);
  }
});


module.exports = router;
