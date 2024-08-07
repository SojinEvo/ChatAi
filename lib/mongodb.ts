import { MongoClient } from 'mongodb';

const uri: string = process.env.MONGODB_URI!!;
console.log('Connecting to MongoDB...', uri);
let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
    throw new Error('Please add your Mongo URI to .env.local');
}

if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable to preserve the MongoClient across module reloads caused by HMR (Hot Module Replacement).
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri);
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri);
    clientPromise = client.connect();
}

export default clientPromise;