import UserService, { CreateUserPayload, getUserTokenPayload } from "../../services/user";

const queries = {
    getUserToken: async (_: any, payload: getUserTokenPayload) => {
        const token = await UserService.getUserToken({
            email: payload.email,
            password: payload.password,
        });
        return token;
    },
    getCurrentLoggedInUser: async (_: any, par: any, context: any) => {
        if (context)
            return context;
        throw new Error("Invalid token")
    }

}
const mutations = {
    createUser: async (_: any, payload: CreateUserPayload) => {
        const res = await UserService.createUser(payload);
        return res.id;
    },
}

export const resolvers = { queries, mutations };