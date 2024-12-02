import 'dotenv/config'
import { config } from './utils/config'

const { dbType, dbName, dbHost, dbHostRo, dbPass, dbPort, dbPoolMax, dbPoolMaxRo, dbPoolMin, dbPoolMinRo, dbUser } = config

export const readOnlyConfig = {
  client: dbType,
  connection: () => ({
    database: dbName,
    host: dbHostRo !== '' ? dbHostRo : dbHost,
    password: dbPass,
    port: +dbPort,
    user: dbUser
  }),
  pool: {
    min: +dbPoolMinRo,
    max: +dbPoolMaxRo,
    propagateCreateError: true
  }
}

export const writeConfig = {
  client: dbType,
  connection: () => ({
    database: dbName,
    host: dbHost,
    password: dbPass,
    port: +dbPort,
    user: dbUser
  }),
  migrations: {
    directory: './migrations',
    tableName: 'knex_migrations'
  },
  seeds: {
    directory: './seeds'
  },
  pool: {
    min: +dbPoolMin,
    max: +dbPoolMax,
    propagateCreateError: true
  }
}

export default writeConfig
