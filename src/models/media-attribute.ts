import Knex from 'knex'
import type { ColumnNameMappers } from 'objection'
import { Model, snakeCaseMappers } from 'objection'

import { readOnlyConfig, writeConfig } from '../knexfile'
import { formatToDBTimestamp } from '../utils/helpers'

const knexWrite = Knex(writeConfig)
const knexReadOnly = Knex(readOnlyConfig)

class MediaAttribute extends Model {
  mediaId!: string
  type!: string
  category!: string
  createdAt!: string
  updatedAt!: string

  static override tableName = 'media_attribute'
  static override idColumn = 'media_id'

  static override jsonSchema = {
    type: 'object',
    required: ['mediaId'],
    properties: {
      mediaId: { type: 'string', minLength: 36, maxLength: 36 },
      type: { type: 'string', maxLength: 50 },
      category: { type: 'string', maxLength: 50 },
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

export const MediaAttributeRW = MediaAttribute.bindKnex(knexWrite)
export const MediaAttributeRO = MediaAttribute.bindKnex(knexReadOnly)

export default MediaAttribute
