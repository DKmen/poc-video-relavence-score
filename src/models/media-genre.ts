import Knex from 'knex'
import type { ColumnNameMappers } from 'objection'
import { Model, snakeCaseMappers } from 'objection'

import { readOnlyConfig, writeConfig } from '../knexfile'
import { formatToDBTimestamp } from '../utils/helpers'
import Genre from './genre'
const knexWrite = Knex(writeConfig)
const knexReadOnly = Knex(readOnlyConfig)

class MediaGenre extends Model {
  mediaId!: string
  genreId!: number
  createdAt!: string
  updatedAt!: string

  static override tableName = 'media_genre'
  static override idColumn = ['media_id', 'genre_id']

  static override jsonSchema = {
    type: 'object',
    properties: {
      mediaId: { type: 'string', minLength: 36, maxLength: 36 },
      genreId: { type: 'integer' }
    }
  }

  static override relationMappings = {
    genre: {
      relation: Model.BelongsToOneRelation,
      modelClass: Genre,
      join: {
        from: 'media_genre.genre_id',
        to: 'genre.id'
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

export const MediaGenreRW = MediaGenre.bindKnex(knexWrite)
export const MediaGenreRO = MediaGenre.bindKnex(knexReadOnly)

export default MediaGenre
