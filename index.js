const http = require("http")
const express = require("express")
const socketio = require("socket.io")
const cors = require("cors")

const PORT = 8000

const generateID = () => Math.floor(Math.random() * 1000)

const app = express()
const server = http.createServer(app)
const io = socketio(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
})

app.use(cors())

io.on("connection", (socket) => {
  console.log("A user has connected")

  socket.emit("connected", socket.id)

  socket.on("send message", (message) => {
    const id = generateID()
    io.emit("message", { ...message, id })
    console.log(message)
  })

  socket.on("disconnect", () => {
    console.log("A user has disconnected")
  })
})

app.get("/", (req, res) => {
  res.send("Hello World from server !")
})

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
