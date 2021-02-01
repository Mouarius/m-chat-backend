const colorsRouter = require("express").Router()
const fs = require("fs")

colorsRouter.get("/", (req, res) => {
  fs.readFile("./etc/colors.json", "utf8", (err, data) => {
    if (err) {
      res
        .status("500")
        .json({ error: `Unable to load colors.json file : ${err}` })
    } else {
      res.json(JSON.parse(data))
    }
  })
})
colorsRouter.get("/random", (req, res) => {
  fs.readFile("./etc/colors.json", "utf8", (err, data) => {
    if (err) {
      res
        .status("500")
        .json({ error: `Unable to load colors.json file : ${err}` })
    } else {
      const { colors } = JSON.parse(data)
      const id = Math.floor(Math.random() * colors.length)
      res.status("200").send({ color: colors[id] })
    }
  })
})

module.exports = colorsRouter
