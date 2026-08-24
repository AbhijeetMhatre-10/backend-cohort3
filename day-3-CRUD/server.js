const express = require("express")
const app = express()
app.use(express.json())

let users = []

//create
app.post('/post', (req, res)=>{
    users = [...users, req.body]
    res.send("User Added")
})

//read
app.get("/",(req, res)=>{
    res.send(users)
})

//put
app.put("/update/:id", (req, res)=>{
    const {id} = req.params
    const body = req.body
    console.log(body)
    users = users.map((x)=> x.id==id?body:x)
    res.send("User updated")
})

//patch
app.patch("/update/:id/age", (req, res)=>{
    const {id} = req.params
    const body = req.body
    users = users.map((x)=>x.id==id?{...x, ...body}:x)
    res.send("User Modified")
})

//delete
app.delete("/delete/:id", (req, res)=>{
    let {id} = req.params
    users = users.filter((x)=>x.id!=id)
    res.send("User Deleted")
})
let port = 3000

app.listen(port, ()=>{
    console.log(`Server is started at ${port}`)
})