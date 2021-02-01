const userRouter = require("express").Router()
const User = require("../models/user")

userRouter.get("/", async (req, res) => {
  const users = await User.find({}).populate("messages", { content: 1 })
  res.status("200").json(users)
})

userRouter.delete("/:id", async (req, res) => {
  const { id } = req.params
  try {
    await User.findByIdAndRemove(id)
    res.status(200).end()
  } catch (e) {
    res.send(e)
  }
})

module.exports = userRouter
