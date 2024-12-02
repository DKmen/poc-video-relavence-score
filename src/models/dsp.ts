import Knex from 'knex'
import type { ColumnNameMappers } from 'objection'
import { Model, snakeCaseMappers } from 'objection'

import { readOnlyConfig, writeConfig } from ''
import { formatToDBTimestamp } from '../utils/helpers'

const knexWrite = Knex(writeConfig)
const knexReadOnly = Knex(readOnlyConfig)

class Dsp extends Model {
  id!: number
  name!: string
  createdAt!: string
  updatedAt!: string

  static override tableName = 'dsp'

  static override jsonSchema = {
    type: 'object',
    required: ['name'],
    properties: {
      id: { type: 'integer' },
      name: { type: 'string', minLength: 1, maxLength: 255 },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' }
    }
  }

  override $beforeInsert (): void {
    const now = formatToDBTimestamp(new Date())
    this.createdAt = now
    this.updatedAt = now
  }

  override $beforeUpdate (): void {
    this.updatedAt = formatToDBTimestamp(new Date())
  }

  static override get columnNameMappers (): ColumnNameMappers {
    return snakeCaseMappers()
  }
}

export const DspRW = Dsp.bindKnex(knexWrite)
export const DspRO = Dsp.bindKnex(knexReadOnly)

export default Dsp
