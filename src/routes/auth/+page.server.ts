import { db } from '../../db/mongo.ts';
import bcrypt from 'bcryptjs';
import { User } from '../../db/UserSchema.ts'

export const actions = {
    login: async ({ cookies, request }) => {
        const data = await request.formData()
        const user = await db
            .collection("Users")
            .findOne({ email: data.get('email') });
        if (!user) {
            return {
                failure: true
            };
        } else if (!(await bcrypt.compare(data.get('password'), user.password))) {
            return {
                failure: true
            };
        } else {
            cookies.set('sessionId', user._id)
            return {
                success: true,
            };
        }
    },
    register: async ({ request, cookies }) => {
        const data = await request.formData()
        const user = await db
            .collection("Users")
            .findOne({ email: data.get('email') });
        if (user) {
            return {
                failure: true,
            };
        }
        const newUser = new User({
            username: data.get('username'),
            email: data.get('email'),
            password: await bcrypt.hash(data.get('password'), 10),
            level: 0,
            scoreMulti: 1,
            scores: [0, 0, 0, 0, 0],
            finalScore: 0,
            isAdmin: false
        });
        await db.collection("Users").insertOne(newUser);
        cookies.set('sessionId', newUser._id)
        return {
            success: true
        };
    }
};

