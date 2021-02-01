const userRouter = require("express").Router()
const fs = require("fs")

userRouter.get("/", (req, res) => {
  fs.readFile("./etc/users.json", "utf8", (err, jsonString) => {
    if (err) {
      console.error("Unable to load users.json file : ", err)
      res
        .status("500")
        .json({ error: `Unable to load users.json file : ${err}` })
    } else {
      res.json(JSON.parse(jsonString))
    }
  })
})

module.exports = userRouter
