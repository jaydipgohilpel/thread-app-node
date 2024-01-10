import express from 'express';


import { expressMiddleware } from '@apollo/server/express4';
import createApolloGraphqlServer from './graphql';
import UserService from './services/user';

async function init() {
    const app = express();
    const PORT = Number(process.env.port) || 8000;
    app.use(express.json())
    // create graphql server

    app.get('/', (req, res) => {
        res.json({ message: "server is running" })
    });

    app.use("/graphql", expressMiddleware(await createApolloGraphqlServer(), {
        context: async ({ req }) => {
            // @ts-ignore
            const token = req.headers['token']
            try {
                const user = UserService.decodeJWTToken(token as string);
                return user;
            }
            catch (err) {
                return {}
            }
        }
    }));
    app.listen(PORT, () => { console.log(`server is listening on port:${PORT}`); });
}

init()