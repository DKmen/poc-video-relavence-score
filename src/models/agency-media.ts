import Knex from 'knex'
import type { ColumnNameMappers } from 'objection'
import { Model, snakeCaseMappers } from 'objection'

import { readOnlyConfig, writeConfig } from '../knexfile'
import { formatToDBTimestamp } from '../utils/helpers'

import Agency from './agency'

const knexWrite = Knex(writeConfig)
const knexReadOnly = Knex(readOnlyConfig)

class AgencyMedia extends Model {
  agencyId!: string
  mediaId!: string
  createdAt!: string
  updatedAt!: string

  static override tableName = 'agency_media'
  static override idColumn = ['media_id', 'agency_id']

  static override relationMappings = {
    agency: {
      relation: Model.HasOneRelation,
      modelClass: Agency,
      join: {
        from: 'agency_media.agency_id',
        to: 'agency.id'
      }
    }
  }

  static override jsonSchema = {
    type: 'object',
    properties: {
      mediaId: { type: 'string', minLength: 36, maxLength: 36 },
      agencyId: { type: 'string', minLength: 36, maxLength: 36 }
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

export const AgencyMediaRW = AgencyMedia.bindKnex(knexWrite)
export const AgencyMediaRO = AgencyMedia.bindKnex(knexReadOnly)

export default AgencyMedia
