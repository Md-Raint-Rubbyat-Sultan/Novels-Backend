import { createClient } from "redis";
import { envVars } from "./env";

export const redisClint = createClient({
  username: envVars.REDIS.REDIS_USERNAME,
  password: envVars.REDIS.REDIS_PASSWORD,
  socket: {
    host: envVars.REDIS.REDIS_HOST,
    port: Number(envVars.REDIS.REDIS_PORT),
  },
});

redisClint.on("error", (err) => console.log("Redis Client Error", err));

// await client.set('foo', 'bar');
// const result = await client.get('foo');
// console.log(result)  // >>> bar

export const connectRedis = async () => {
  if (!redisClint.isOpen) {
    await redisClint.connect();
    console.log("Connented to redis.");
  }
};
