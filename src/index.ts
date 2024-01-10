import express from 'express';


import { expressMiddleware } from '@apollo/server/express4';
import createApolloGraphqlServer from './graphql';

async function init() {
    const app = express();
    const PORT = Number(process.env.port) || 8000;
    app.use(express.json())
    // create graphql server

    app.get('/', (req, res) => {
        res.json({ message: "server is running" })
    });

    app.use("/graphql", expressMiddleware(await createApolloGraphqlServer()));
    app.listen(PORT, () => { console.log(`server is listening on port:${PORT}`); });
}

init()