import { db } from "../../db/mongo";
export async function load() {
    const user = await db.collection("Users").find({}).toArray()
    // const juser = await user.json()
    // const usersData = []
    console.log(user)
    const userDetails = JSON.stringify(user)
    return {
        userDetails
    }
}
