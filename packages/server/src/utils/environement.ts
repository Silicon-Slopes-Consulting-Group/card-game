type Variables = {
    NODE_ENV: 'developement' | 'production' | 'test',
    PORT: number,
    MONGO_USER: string,
    MONGO_PASSWORD: string,
    MONGO_CLUSTER: string,
    MONGO_DB: string,
    CLIENT_URL: string,
    JWT_SECRET: string,
}

const VARIABLES: (keyof Variables)[] = ['NODE_ENV', 'PORT', 'MONGO_USER', 'MONGO_PASSWORD', 'MONGO_CLUSTER', 'MONGO_DB', 'CLIENT_URL', 'JWT_SECRET'];

const DEFAULT_VALUES: Partial<Variables> = {
    PORT: 3000,
};

export function verifyVariables () {
    for (const variable of VARIABLES) {
        if (!process.env[variable] && !DEFAULT_VALUES[variable]) throw new Error(`Environement variable "${variable}" not set`);
    }
}

export function getVariable<T extends keyof Variables>(variable: T): Variables[T] {
    const v = process.env[variable] ?? DEFAULT_VALUES[variable];
    if (!v) throw new Error(`Environement variable "${variable}" not set`);
    return v as Variables[T];
}