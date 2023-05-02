import { db } from "../../db/mongo";
export async function load() {
    const user = await db.collection("Users").find({ level: 5 }).sort({ finalScore: 1 }).limit(10).toArray()
    // const juser = await user.json()
    // const usersData = []
    const userDetails = JSON.stringify(user)
    return {
        userDetails
    }
}
