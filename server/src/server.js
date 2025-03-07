import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./config/connectDB.js";

// dotenv.config({ path: "./.env" });
dotenv.config();

connectDB()
.then( () => {
    const myPort = process.env.PORT;
    app.listen(myPort, () => {
        console.log(`Server is listening on port ${myPort}`);
    })
} )
.catch ( (err) => {
    console.log(`DB connection failed: ${err.message}`);
})