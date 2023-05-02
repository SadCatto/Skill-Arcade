import { db } from "../../../db/mongo";
import { ObjectId } from "mongodb";

export async function PUT({ params, request, cookies }) {
    const dataToPut = await request.json();
    const user_id = new ObjectId(cookies.get('sessionId'))
    let levelNum = dataToPut.level
    const time = Math.floor(dataToPut.time / 1000)
    const scoreMulti = dataToPut.scoreMulti
    const user = await db.collection("Users").findOne({ _id: user_id })
    if (!user) {
        console.log("User noi mila :(");
        return
    }
    const scoresArray = user.scores;
    let finalScore = user.finalScore;
    if (scoresArray[levelNum] === 0) {
        scoresArray[levelNum] = time
        finalScore += time
    }
    else {
        finalScore -= scoresArray[levelNum]
        finalScore += time
        scoresArray[levelNum] = time
    }
    levelNum++;
    await db.collection("Users").findOneAndUpdate({ _id: user_id }, { $set: { scores: scoresArray, level: levelNum, finalScore: finalScore, scoreMulti: scoreMulti } })
    return new Response(null, { status: 204 });
}
