import { db } from "../../db/mongo"
import { times } from "$lib/UserStore.js"
import { get } from "svelte/store"
import { ObjectId } from "mongodb";

export async function load({ cookies }) {
    // const sortedUsers = db.collection("Users").find().sort({ scores: 1 })
    const user_id = new ObjectId(cookies.get('sessionId'))
    const user = await db.collection("Users").findOne({ _id: user_id })
    const usersData = get(times)
    let finalScore = 0
    usersData.map((userScore) => {
        finalScore += userScore
    })
    await db.collection("Users").findOneAndUpdate({ _id: user_id }, { $set: { finalScore: finalScore } })
}
