import { redis } from "./redis";

const WINDOW_SECONDS = 15 * 60;
const MAX_ATTEMPTS = 5;

const ipKey = (ip: string) => `login_attempts:ip:${ip}`;
const emailKey = (email: string) => `login_attempts:email:${email}`;

const bumpCounter = async (key: string): Promise<void> => {
    const count = await redis.incr(key);

    if (count === 1) {
        await redis.expire(key, WINDOW_SECONDS);
    }
};

export const checkLoginRateLimit = async (
    ip: string,
    email: string
): Promise<{ limited: boolean }> => {
    const [ipCount, emailCount] = await Promise.all([
        redis.get(ipKey(ip)),
        redis.get(emailKey(email)),
    ]);

    const limited =
        (ipCount !== null && Number(ipCount) >= MAX_ATTEMPTS) ||
        (emailCount !== null && Number(emailCount) >= MAX_ATTEMPTS);

    return { limited };
};

export const recordFailedLoginAttempt = async (ip: string, email: string): Promise<void> => {
    await Promise.all([bumpCounter(ipKey(ip)), bumpCounter(emailKey(email))]);
};

export const clearLoginAttempts = async (ip: string, email: string): Promise<void> => {
    await Promise.all([redis.del(ipKey(ip)), redis.del(emailKey(email))]);
};
