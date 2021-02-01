const http = require("http")
const express = require("express")
const socketio = require("socket.io")
const cors = require("cors")
const mongoose = require("mongoose")
const loginRouter = require("./controllers/login")
const userRouter = require("./controllers/users")
const colorsRouter = require("./controllers/colors")
const config = require("./util/config")

const Message = require("./models/message")
const User = require("./models/user")

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
  let userObject

  socket.on("login", (data) => {
    console.log("We have a new logged in user : ", data)
    userObject = {
      username: data.username,
      socketID: socket.id,
      colorTag: data.color,
    }
    const newUser = new User(userObject)
    newUser.save()
    io.emit("logged user", newUser)
    socket.emit("login success", newUser)
  })

  socket.on("send message", (message) => {
    const id = generateID()
    io.emit("message", { ...message, id })
    console.log(message)
  })

  socket.on("disconnect", async () => {
    console.log("A user has disconnected")
    await User.deleteMany({ username: userObject.username })
    io.emit("user quit")
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
