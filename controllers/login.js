const loginRouter = require("express").Router()
const fs = require("fs")

loginRouter.post("/", (req, res) => {
  const { body } = req
  console.log("body :>> ", body)

  if (body.username) {
    fs.readFile("./etc/users.json", "utf8", (err, data) => {
      if (err) {
        console.error("Unable to load users.json file : ", err)
        res
          .status("500")
          .json({ error: `Unable to load users.json file : ${err}` })
      } else {
        const usersFile = JSON.parse(data)
        console.log("users :>> ", usersFile)
        usersFile.users.push(body.username)
        fs.writeFile("./etc/users.json", JSON.stringify(usersFile), (err) => {
          res
            .status("500")
            .json({ error: `Unable to write users.json file : ${err}` })
        })
        res.status(200).json(usersFile)
      }
    })
  } else {
    res.status(400).json({ error: "Invalid username." })
  }
})

module.exports = loginRouter
