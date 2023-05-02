import { db } from "../../../db/mongo";
import { ObjectId } from "mongodb";

export async function PUT({ params, request, cookies }) {
    const dataToPut = await request.json();
    const user_id = new ObjectId(cookies.get('sessionId'))
    const scoreMulti = dataToPut.scoreMulti
    const levelNum = 0
    const user = await db.collection("Users").findOne({ _id: user_id })
    if (!user) {
        console.log("User noi mila :(");
        return
    }
    let finalScore = user.finalScore;
    finalScore = finalScore * finalScore
    await db.collection("Users").findOneAndUpdate({ _id: user_id }, { $set: { level: levelNum, finalScore: finalScore, scoreMulti: scoreMulti } })
    return new Response(null, { status: 204 });
}
