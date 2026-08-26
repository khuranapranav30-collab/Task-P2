const express = require("express")
const app = express()
app.use(express.static(__dirname))

const bodyParser = require("body-parser")
app.use(express.urlencoded({ extended: true }))

const dotenv = require("dotenv")
dotenv.config({ path: "credentials.env" })
console.log(process.env.MAILGUN_API_KEY)

const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);
const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/personal_website.html")
})

app.post("/", (req, res) => {
    console.log(req.body)
    const email = req.body.email

    mg.messages.create('sandbox329b59f9c6ea47978ae4b4741fab3166.mailgun.org', {
        from: "postmaster@sandbox329b59f9c6ea47978ae4b4741fab3166.mailgun.org",
        to: email,
        subject: "Welcome to DEV@Deakin",
        text: "Welcome to DEV@Deakin! Thank you for subscribing.",
        html: "<h1>Welcome to DEV@Deakin! Thank you for subscribing.</h1>"
    })
        .then(msg => {
            console.log(msg)
            res.status(200).send("Welcome email sent successfully")
        })
        .catch(err => {
            console.error(err)
            res.status(500).send("Failed to send welcome email")
        })
})

app.listen(3000, function () {
    console.log("Server is running on port 3000")
})