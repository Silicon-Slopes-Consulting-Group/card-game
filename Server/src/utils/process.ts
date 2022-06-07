export enum ProcessEnvironment {
    Production = 'production',
    Development = 'development',
    Default = '',
}

export default class ProcessUtils {
    static getEnvironment(): ProcessEnvironment {
        switch (process.env.NODE_ENV) {
        case ProcessEnvironment.Production:
            return ProcessEnvironment.Production;
        case ProcessEnvironment.Development:
            return ProcessEnvironment.Development;
        default:
            return ProcessEnvironment.Default;
        }
    }

    static isProduction(): boolean {
        return process.env.NODE_ENV === 'production';
    }

    static isDevelopment(): boolean {
        return process.env.NODE_ENV === 'development';
    }
}