import Knex from 'knex'
import type { ColumnNameMappers } from 'objection'
import { Model, snakeCaseMappers } from 'objection'

import { readOnlyConfig, writeConfig } from '../knexfile'
import { formatToDBTimestamp } from '../utils/helpers'

const knexWrite = Knex(writeConfig)
const knexReadOnly = Knex(readOnlyConfig)

class Genre extends Model {
  id!: number
  genre!: string
  createdAt!: string
  updatedAt!: string

  static override tableName = 'genre'

  static override jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      genre: { type: 'string', minLength: 1, maxLength: 50 }
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

export const GenreRW = Genre.bindKnex(knexWrite)
export const GenreRO = Genre.bindKnex(knexReadOnly)

export default Genre
