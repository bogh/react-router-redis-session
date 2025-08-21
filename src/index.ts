import { randomBytes as crypto_randomBytes } from "node:crypto";

import Redis from "ioredis";
import {
	type SessionData,
	type SessionIdStorageStrategy,
	type SessionStorage,
	createSessionStorage,
} from "react-router";

function genRandomID(): string {
	const randomBytes = crypto_randomBytes(8);
	return Buffer.from(randomBytes).toString("hex");
}

const expiresToSeconds = (expires: Date) => {
	const now = new Date();
	const expiresDate = new Date(expires);
	const secondsDelta = Math.round(
		(expiresDate.getTime() - now.getTime()) / 1000,
	);
	return secondsDelta < 0 ? 0 : secondsDelta;
};

type RedisSessionConfig = {
	cookie: SessionIdStorageStrategy["cookie"];
	options: {
		redisConfig?: Redis.RedisOptions;
		redisClient?: Redis.Redis;
	};
};

export function createRedisSessionStorage<
	Data = SessionData,
	FlashData = Data,
>({ cookie, options }: RedisSessionConfig): SessionStorage<Data, FlashData> {
	let redis: Redis.Redis;
	if (options.redisClient) {
		redis = options.redisClient;
	} else if (options.redisConfig) {
		redis = new Redis(options.redisConfig);
	} else {
		throw new Error(
			"Need to provide either options.RedisConfig or options.redisClient",
		);
	}
	return createSessionStorage({
		cookie,
		async createData(data, expires) {
			const id = genRandomID();
			if (expires) {
				await redis.set(
					id,
					JSON.stringify(data),
					"EX",
					expiresToSeconds(expires),
				);
			} else {
				await redis.set(id, JSON.stringify(data));
			}
			return id;
		},
		async readData(id) {
			const data = await redis.get(id);
			if (data) {
				return JSON.parse(data);
			}
			return null;
		},
		async updateData(id, data, expires) {
			if (expires) {
				await redis.set(
					id,
					JSON.stringify(data),
					"EX",
					expiresToSeconds(expires),
				);
			} else {
				await redis.set(id, JSON.stringify(data));
			}
		},
		async deleteData(id) {
			await redis.del(id);
		},
	});
}
