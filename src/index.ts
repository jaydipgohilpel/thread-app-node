import express from 'express';

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { prismaClient } from './lib/db';



async function init() {
    const app = express();
    const PORT = Number(process.env.port) || 8000;
    app.use(express.json())
    // create graphql server
    const graphQlServer = new ApolloServer({
        typeDefs: `
        type Query{
           name: String, 
           giveName(name:String):String
        }

        type Mutation{
            crateUser(firstName:String!,lastName:String!,email:String!,password:String!):Boolean
        }
        
        `,
        resolvers: {
            Query: {
                name: () => "hello graphql, i am xyz",
                giveName: (_, { name }: { name: string }) => `Hello ${name}, how are you`
            },
            Mutation: {
                crateUser: async (_,
                    {
                        firstName, lastName, email, password
                    }:
                        {
                            firstName: string, lastName: string,
                            email: string, password: string, salt: string
                        }) => {
                    await prismaClient.user.create(
                        {
                            data: {
                                email,
                                firstName,
                                lastName,
                                password,
                                salt: 'random'
                            }
                        }
                    );
                    return true;
                }
            }
        }
    });

    // graphql server starts
    await graphQlServer.start();
    app.get('/', (req, res) => {
        res.json({ message: "server is running" })
    });


    app.use("/graphql", expressMiddleware(graphQlServer));
    app.listen(PORT, () => { console.log(`server is listening on port:${PORT}`); });
}

init()