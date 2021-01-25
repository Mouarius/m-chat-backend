const http = require("http")
const express = require("express")
const socketio = require("socket.io")
const cors = require("cors")
const loginRouter = require("./controllers/login")

const PORT = process.env.PORT || 8000

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

app.use(express.static("build"))
app.use(express.json())
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

app.use("/api/login", loginRouter)

// app.get("/", (req, res) => {
//   res.send("Hello World from server !")
// })

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
