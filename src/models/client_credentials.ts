import { Model, snakeCaseMappers } from 'objection'
import Knex from 'knex'
import type { ColumnNameMappers } from 'objection'

import { formatToDBTimestamp } from '../utils/helpers'
import { writeConfig, readOnlyConfig } from '../knexfile'

const knexWrite = Knex(writeConfig)
const knexReadOnly = Knex(readOnlyConfig)

class ClientCredentials extends Model {
  apiKey!: string
  allowAccessTo!: string
  createdAt!: string
  updatedAt!: string

  static override tableName = 'client_credentials'
  static override idColumn = ['api_key', 'allow_access_to']

  static override jsonSchema = {
    type: 'object',
    properties: {
      apiKey: { type: 'string', minLength: 36, maxLength: 36 },
      allowAccessTo: { type: 'string', maxLength: 255 }
    }
  }

  override $beforeInsert (): void {
    this.createdAt = formatToDBTimestamp(new Date())
    this.updatedAt = formatToDBTimestamp(new Date())
  }

  override $beforeUpdate (): void {
    this.updatedAt = formatToDBTimestamp(new Date())
  }

  static override get columnNameMappers (): ColumnNameMappers {
    return snakeCaseMappers()
  }
}

export const ClientCredentialsRW = ClientCredentials.bindKnex(knexWrite)
export const ClientCredentialsRO = ClientCredentials.bindKnex(knexReadOnly)

export default ClientCredentials
