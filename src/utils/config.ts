interface IConfig {
    gcpProjectId: string;
    gcpLocation: string;
    gcpModelName: string;
    dbName: string;
    dbHost: string;
    dbHostRo: string;
    dbUser: string;
    dbPass: string;
    dbPort: string;
    dbType: string;
    dbPoolMinRo: string;
    dbPoolMin: string;
    dbPoolMaxRo: string;
    dbPoolMax: string;
}

export const config: IConfig = {
    gcpProjectId: process.env.GOOGLE_PROJECT_ID || 'YOUR_GCP_PROJECT_ID',
    gcpLocation: process.env.GOOGLE_LOCATION || 'YOUR_GCP_LOCATION',
    gcpModelName: process.env.GOOGLE_MODEL_NAME || 'YOUR_GCP_MODEL_NAME',
    dbName: process.env['DB_NAME'] ?? '',
    dbHost: process.env['DB_HOST'] ?? '',
    dbHostRo: process.env['DB_HOST_RO'] ?? '',
    dbUser: process.env['DB_USER'] ?? '',
    dbPass: process.env['DB_PASS'] ?? '',
    dbPort: process.env['DB_PORT'] ?? '5432',
    dbType: process.env['DB_TYPE'] ?? 'pg',
    dbPoolMinRo: process.env['DB_POOL_MIN_RO'] ?? '1',
    dbPoolMin: process.env['DB_POOL_MIN'] ?? '1',
    dbPoolMaxRo: process.env['DB_POOL_MAX_RO'] ?? '3',
    dbPoolMax: process.env['DB_POOL_MAX'] ?? '3',
};