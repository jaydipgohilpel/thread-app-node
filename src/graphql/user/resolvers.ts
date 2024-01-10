const queries = {}
const mutations = {
    createUser: async (_: any, { }, { }) => { return 'createUser' },
}

export const resolvers = { queries, mutations };