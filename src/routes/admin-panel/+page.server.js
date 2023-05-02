import { db } from "../../db/mongo";
export async function load() {
    const user = await db.collection("Users").find({}).sort({ level: -1 }).toArray()
    // const juser = await user.json()
    // const usersData = []
    const userDetails = JSON.stringify(user)
    return {
        userDetails
    }
}
