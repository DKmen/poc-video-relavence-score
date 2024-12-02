import Knex from 'knex'
import type { ColumnNameMappers } from 'objection'
import { Model, snakeCaseMappers } from 'objection'

import { readOnlyConfig, writeConfig } from '../knexfile'
import { formatToDBTimestamp } from '../utils/helpers'

const knexWrite = Knex(writeConfig)
const knexReadOnly = Knex(readOnlyConfig)

class Tag extends Model {
  id!: number
  tag!: string
  isReserved!: number
  createdAt!: string
  updatedAt!: string

  static override tableName = 'tag'

  static override jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      tag: { type: 'string', maxLength: 50 },
      isReserved: { type: 'number' },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' }
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

export const TagRW = Tag.bindKnex(knexWrite)
export const TagRO = Tag.bindKnex(knexReadOnly)

export default Tag
