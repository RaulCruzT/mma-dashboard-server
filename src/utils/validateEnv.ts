import { cleanEnv } from 'envalid';
import { port, str } from 'envalid/dist/validators';

export default cleanEnv(process.env, {
    MONGO_CONNECTION_STRING: str(),
    PORT: port(),
    GOOGLE_OAUTH_CLIENT_ID: str(),
    GOOGLE_OAUTH_CLIENT_SECRET: str(),
    URL_FRONTEND: str()
})