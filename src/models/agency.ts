import { Model, snakeCaseMappers } from 'objection'
import Knex from 'knex'
import type { ColumnNameMappers } from 'objection'

import { formatToDBTimestamp } from '../utils/helpers'
import { writeConfig, readOnlyConfig } from '../knexfile'

const knexWrite = Knex(writeConfig)
const knexReadOnly = Knex(readOnlyConfig)

class Agency extends Model {
  id!: string
  name!: string
  type!: 'publisher' | 'advertiser'
  createdAt!: string
  updatedAt!: string

  static override tableName = 'agency'

  static override jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string', minLength: 36, maxLength: 36 },
      name: { type: 'string', minLength: 1, maxLength: 36 },
      type: { type: 'string', enum: ['publisher', 'advertiser'] }
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

export const AgencyRW = Agency.bindKnex(knexWrite)
export const AgencyRO = Agency.bindKnex(knexReadOnly)

export default Agency
