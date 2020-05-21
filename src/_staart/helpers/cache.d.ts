/**
 * Get an item from Redis cache
 * @param key - Key
 */
export declare const getItemFromCache: <T = {}>(key: string) => Promise<T>;
/**
 * Delete items from Redis cache
 * @param keys - Keys to delete
 */
export declare const deleteItemFromCache: (...keys: string[]) => Promise<number>;
/**
 * Set a new item in Redis cache
 * @param key - Item key
 * @param value - Item value object
 * @param expiry - Expiry time (defaults to 10 mins)
 */
export declare const setItemInCache: (key: string, value: any, expiry?: Date | undefined) => Promise<void>;
