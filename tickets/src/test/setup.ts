import {MongoMemoryServer} from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

declare global {
    namespace NodeJS {
        interface Global {
            signin():string[];
        }
    }
}

let mongo: any;

beforeAll(async () => {
    process.env.JWT_KEY = 'asfasfdsadf';

    mongo = new MongoMemoryServer();
    const mongoUri = await mongo.getUri();

    await mongoose.connect(mongoUri, {
       useNewUrlParser: true,
       useUnifiedTopology: true
    });
});

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
});

// To avoid having a separate import
global.signin = () => {
    // Build a JWT payload { id, email }
    const payload = {
        id: 'skjoiwuelkasn',
        email: 'test@test.com'
    }

    // Create the JWT!
    const token = jwt.sign(payload, process.env.JWT_KEY!);

    // Build up session object { jwt: MY_JSW }
    const session = { jwt: token };

    // Turn that session into JSON
    const sessionJSON = JSON.stringify(session);

    // Take JSON and encode as base64
    const base64 = Buffer.from(sessionJSON).toString('base64');

    // Return a string that's the cookie with the encoded data
    return [`express:sess=${base64}`];
};
