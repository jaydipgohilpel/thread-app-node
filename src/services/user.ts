import { prismaClient } from "../lib/db";
import { createHmac, randomBytes } from 'node:crypto'
const jwt = require('jsonwebtoken');
const jwtSecret = '$asmmldfml@#XCSDFGfff1545454ASDAd'

export interface CreateUserPayload {
    firstName: string,
    lastName?: string,
    email: string,
    password: string
}

export interface getUserTokenPayload {
    email: string,
    password: string
}


class UserService {
    public static createUser(payload: CreateUserPayload) {
        const { firstName, lastName, email, password } = payload;
        const salt = randomBytes(32).toString("hex");
        return prismaClient.user.create({
            data: {
                firstName,
                lastName,
                email,
                salt,
                password: this.generateHash(salt, password)
            }
        })
    }

    private static generateHash(salt: string, password: string) {
        const hashedPassword = createHmac("sha256", salt)
            .update(password)
            .digest("hex");
        return hashedPassword
    }

    private static getUserByEmail(email: string) {
        return prismaClient.user.findUnique({ where: { email } })
    }

    public static async getUserToken(payload: getUserTokenPayload) {
        const { email, password } = payload;
        const user = await this.getUserByEmail(email);
        if (!user) throw new Error('User not found');

        const hashedPassword = this.generateHash(user.salt, password);
        if (hashedPassword !== user.password) throw new Error('Incorrect Password');

        // generate token
        const token = jwt.sign({ id: user.id, email: user.email }, jwtSecret)
        return token;
    }
}

export default UserService