import { ApolloServer } from '@apollo/server';
import { prismaClient } from '../lib/db';
import { User } from './user/index'

async function createApolloGraphqlServer() {
    const graphQlServer = new ApolloServer({
        typeDefs: `
     ${User.typeDefs}
    type Query{
        ${User.queries}
    }

    type Mutation{
        ${User.mutations}
    }
    `,
        resolvers: {
            Query: {
                ...User.resolvers.queries
            },
            Mutation: {
                ...User.resolvers.mutations
            }
        }
    });

    // graphql server starts
    await graphQlServer.start();

    return graphQlServer;
}

export default createApolloGraphqlServer

// const graphQlServer = new ApolloServer({
//     typeDefs: `
// type Query{
//    name: String,
//    giveName(name:String):String
// }

// type Mutation{
//     crateUser(firstName:String!,lastName:String!,email:String!,password:String!):Boolean
// }

// `,
//     resolvers: {
//         Query: {
//             name: () => "hello graphql, i am xyz",
//             giveName: (_, { name }: { name: string }) => `Hello ${name}, how are you`
//         },
//         Mutation: {
//             crateUser: async (_,
//                 {
//                     firstName, lastName, email, password
//                 }:
//                     {
//                         firstName: string, lastName: string,
//                         email: string, password: string, salt: string
//                     }) => {
//                 await prismaClient.user.create(
//                     {
//                         data: {
//                             email,
//                             firstName,
//                             lastName,
//                             password,
//                             salt: 'random'
//                         }
//                     }
//                 );
//                 return true;
//             }
//         }
//     }
// });

