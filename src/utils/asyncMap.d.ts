type IterateeFunction<T, U> = (item: T, i: string) => Promise<U>;

export default function <T, U>(array: T[], iteratee: IterateeFunction<T, U>): Promise<U[]>;
