import Knex from 'knex'
import type { ColumnNameMappers } from 'objection'
import { Model, snakeCaseMappers } from 'objection'

import { readOnlyConfig, writeConfig } from '../knexfile'
import { formatToDBTimestamp } from '../utils/helpers'

const knexWrite = Knex(writeConfig)
const knexReadOnly = Knex(readOnlyConfig)

class Platform extends Model {
  id!: number
  platform!: string
  createdAt!: string
  updatedAt!: string

  static override tableName = 'platform'

  static override jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      platform: { type: 'string', minLength: 1, maxLength: 50 }
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

export const PlatformRW = Platform.bindKnex(knexWrite)
export const PlatformRO = Platform.bindKnex(knexReadOnly)

export default Platform
