import Knex from 'knex'
import type { ColumnNameMappers } from 'objection'
import { Model, snakeCaseMappers } from 'objection'

import { readOnlyConfig, writeConfig } from '../knexfile'
import Agency from './agency'
import Media from './media'
import { formatToDBTimestamp } from '../utils/helpers'

const knexWrite = Knex(writeConfig)
const knexReadOnly = Knex(readOnlyConfig)

class AgencyMatchingResult extends Model {
  id!: string
  agencyId!: string
  publisherMediaId!: string
  advertiserMediaId!: string
  chapterNumber!: number
  adBreak!: number
  adBreakNumber!: number
  adBreakRelavance!: number
  matchingInfo!: string
  createdAt!: string
  updatedAt!: string

  static override tableName = 'agency_matching_result'

  static override relationMappings = {
    agency: {
      relation: Model.HasOneRelation,
      modelClass: Agency,
      join: {
        from: 'agency_matching_result.agency_id',
        to: 'agency.id'
      }
    },
    publisherMedia: {
      relation: Model.HasOneRelation,
      modelClass: Media,
      join: {
        from: 'agency_matching_result.publisher_media_id',
        to: 'media.id'
      }
    },
    advertiserMedia: {
      relation: Model.HasOneRelation,
      modelClass: Media,
      join: {
        from: 'agency_matching_result.advertiser_media_id',
        to: 'media.id'
      }
    }
  }

  static override jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string', minLength: 36, maxLength: 36 },
      agencyId: { type: 'string', minLength: 36, maxLength: 36 },
      publisherMediaId: { type: 'string', minLength: 36, maxLength: 36 },
      advertiserMediaId: { type: 'string', minLength: 36, maxLength: 36 },
      chapterNumber: { type: 'integer' },
      adBreak: { type: 'integer' },
      adBreakNumber: { type: 'integer' },
      adBreakRelavance: { type: 'integer' },
      matchingInfo: { type: 'string' }
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

export const AgencyMatchingResultRW = AgencyMatchingResult.bindKnex(knexWrite)
export const AgencyMatchingResultRO = AgencyMatchingResult.bindKnex(knexReadOnly)

export default AgencyMatchingResult
