import Knex from 'knex'
import type { ColumnNameMappers } from 'objection'
import { Model, snakeCaseMappers } from 'objection'

import { readOnlyConfig, writeConfig } from '../knexfile'
import { formatToDBTimestamp } from '../utils/helpers'
import Tag from './tag'

const knexWrite = Knex(writeConfig)
const knexReadOnly = Knex(readOnlyConfig)

class MediaTag extends Model {
  mediaId!: string
  tagId!: number
  createdAt!: string
  updatedAt!: string

  static override tableName = 'media_tag'
  static override idColumn = ['media_id', 'tag_id']

  static override jsonSchema = {
    type: 'object',
    properties: {
      mediaId: { type: 'string', minLength: 36, maxLength: 36 },
      tagId: { type: 'integer' },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' }
    }
  }

  static override relationMappings = {
    tag: {
      relation: Model.BelongsToOneRelation,
      modelClass: Tag,
      join: {
        from: 'media_tag.tag_id',
        to: 'tag.id'
      }
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

export const MediaTagRW = MediaTag.bindKnex(knexWrite)
export const MediaTagRO = MediaTag.bindKnex(knexReadOnly)

export default MediaTag
