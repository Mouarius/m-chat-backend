const http = require("http")
const express = require("express")
const socketio = require("socket.io")
const cors = require("cors")
const mongoose = require("mongoose")
const loginRouter = require("./controllers/login")
const userRouter = require("./controllers/users")
const colorsRouter = require("./controllers/colors")
const config = require("./util/config")

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

console.log("Connecting to MongoDB...")
mongoose
  .connect(config.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("connected to MongoDB")
  })
  .catch((error) => {
    console.error("error connecting to MongoDB:", error.message)
  })

app.use(express.json())
app.use(express.static("build"))
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
app.use("/api/users", userRouter)
app.use("/api/colors", colorsRouter)

app.get("/", (req, res) => {
  res.send("Hello World from server !")
})

server.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`)
})
