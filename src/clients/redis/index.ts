import * as redis from 'redis';

// Create a Redis client instance
const client = redis.createClient();

(async () => { await client.connect(); })();

// Handle various client events
client.on('connect', () => {
    console.log("Client connected to Redis.....");
});

client.on('ready', () => {
    console.log("Client connected to Redis and ready to use.....");
});

client.on('error', (err) => {
    console.error("Error:", err.message);
});

client.on('end', () => {
    console.log("Client disconnected from Redis.....");
});

// Gracefully handle process termination
process.on('SIGINT',  () => {
    console.log("Client disconnected and quit Redis.....");
    client.quit();
    // client.quit(() => {
    //     console.log("Client disconnected and quit Redis.....");
    //     process.exit(0);
    // });
});

export default client;