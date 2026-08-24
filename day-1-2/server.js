// const http = require('http')

// const server = http.createServer((req, res)=>{
//     if(req.url=="/" && req.method =="GET"){
//         res.end("Ok Got it")
//     }
// })

// server.listen(3000, ()=>{
//     console.log("server is running at port 3000")
// })

const express = require("express")
const app = express();

app.get("/", (req, res)=>{
    res.send("I am on home")
})

let port = 3000

app.listen(port, ()=>{
    console.log(`server is running at ${port}`)
})