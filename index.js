const connectToMongo = require("./db");
const express = require('express')
var cors = require('cors')
const app = express()
const port = 3001

app.use(cors());

connectToMongo();

app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));


app.listen(port, () => {
  // console.log(`Example app listening on port ${port}`)
})
