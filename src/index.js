import {app} from "./app.js";
import { connectDB } from "./db/config.js";
import "dotenv/config";

connectDB()
 .then(()=> {
     app.listen(process.env.PORT,()=> {
     console.log(`app is running on port ${process.env.PORT}`);
})
 })
 .catch((err)=> console.log(err,"error in running our app"))