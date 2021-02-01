const loginRouter = require("express").Router()
const fs = require("fs")
const User = require("../models/user")

loginRouter.post("/", async (req, res) => {
  const { body } = req
  console.log("body :>> ", body)

  try {
    const userInDb = await User.find({ username: body.username })
    console.log("userInDb :>> ", userInDb)
    if (userInDb === []) {
      res.status(401).json({ error: "Username is already taken." })
    } else {
      const newUser = new User({ username: body.username })
      await newUser.save()
      res.status(201).json(newUser)
    }
  } catch (e) {
    res.send(e)
  }
})

module.exports = loginRouter
