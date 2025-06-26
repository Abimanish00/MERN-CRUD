import dbConfig from "../config/db.config.js";
import mongoose from "mongoose";
import Tutorial from "./tutorial.model.js";
 
mongoose.Promise = global.Promise;
 
const db = {};
db.mongoose = mongoose;
db.url = `mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`;
db.tutorials = Tutorial(mongoose);
 
export default db;