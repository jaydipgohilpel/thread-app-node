import express from 'express';

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';



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
        }`,
        resolvers: {
            Query: {
                name: () => "hello graphql, i am xyz",
                giveName: (_, { name }: { name: String }) => `Hello ${name}, how are you`
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