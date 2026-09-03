const dotenv = require("dotenv")
dotenv.config()
const app = require("./src/app")

app.listen(process.env.port, ()=>{
    console.log("server is started at 3000")
})