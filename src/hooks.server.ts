import { start_mongo } from "./db/mongo.ts";

start_mongo().then(() => {
    console.log("Database started")
})