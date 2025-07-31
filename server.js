const app = require("./app");
require("dotenv").config();
const connectDb = require("./config/db");

const port = process.env.PORT || 5000;


app.listen(port,async()=>{
  await connectDb();
  console.log(`server running on http://localhost:${port}`)
})