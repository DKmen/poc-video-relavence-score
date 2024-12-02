import Knex from 'knex'
import type { ColumnNameMappers } from 'objection'
import { Model, snakeCaseMappers } from 'objection'

import { readOnlyConfig, writeConfig } from '../knexfile'
import type MatchingStatus from '../types/matchingStatus'
import { formatToDBTimestamp } from '../utils/helpers'
import Agency from './agency'

const knexWrite = Knex(writeConfig)
const knexReadOnly = Knex(readOnlyConfig)

class AgencyMatching extends Model {
  id!: string
  agencyId!: string
  status!: MatchingStatus
  createdAt!: string
  updatedAt!: string

  static override tableName = 'agency_matching'

  static override relationMappings = {
    agency: {
      relation: Model.HasOneRelation,
      modelClass: Agency,
      join: {
        from: 'agency_matching.agency_id',
        to: 'agency.id'
      }
    }
  }

  static override jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string', minLength: 36, maxLength: 36 },
      agencyId: { type: 'string', minLength: 36, maxLength: 36 },
      status: { type: 'string', enum: ['PROCESSING', 'COMPLETED', 'FAILED'] }
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

export const AgencyMatchingRW = AgencyMatching.bindKnex(knexWrite)
export const AgencyMatchingRO = AgencyMatching.bindKnex(knexReadOnly)

export default AgencyMatching
