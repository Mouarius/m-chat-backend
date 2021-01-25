const loginRouter = require("express").Router()

loginRouter.post("/", (req, res) => {
  const { body } = req
  console.log("body :>> ", body)
  if (body.username) res.status(200).json({ username: body.username })
  else {
    res.status(400).json({ error: "Invalid username." })
  }
})

module.exports = loginRouter
