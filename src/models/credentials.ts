import { Model, snakeCaseMappers } from 'objection'
import Knex from 'knex'
import type { ColumnNameMappers } from 'objection'

import { formatToDBTimestamp } from '../utils/helpers'
import { writeConfig, readOnlyConfig } from '../knexfile'

const knexWrite = Knex(writeConfig)
const knexReadOnly = Knex(readOnlyConfig)

class Credential extends Model {
  userId!: string
  sourceId!: string
  source!: 'google' | 'email'
  type!: 'admin' | 'publisher' | 'advertiser'
  createdAt!: string
  updatedAt!: string

  static override tableName = 'credential'
  static override idColumn = ['source_id', 'source', 'type']

  static override jsonSchema = {
    type: 'object',
    properties: {
      userId: { type: 'string', minLength: 36, maxLength: 36 },
      sourceId: { type: 'string', maxLength: 255 },
      source: { type: 'string', enum: ['google', 'email'] },
      type: { type: 'string', enum: ['admin', 'publisher', 'advertiser'] }
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

export const CredentialRW = Credential.bindKnex(knexWrite)
export const CredentialRO = Credential.bindKnex(knexReadOnly)

export default Credential
