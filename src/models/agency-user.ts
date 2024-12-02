import Knex from 'knex'
import type { ColumnNameMappers } from 'objection'
import { Model, snakeCaseMappers } from 'objection'

import { readOnlyConfig, writeConfig } from '../knexfile'
import { formatToDBTimestamp } from '../utils/helpers'
import Agency from './agency'
import User from './user'

const knexWrite = Knex(writeConfig)
const knexReadOnly = Knex(readOnlyConfig)

class AgencyUser extends Model {
  userId!: string
  agencyId!: string
  updatedBy!: string
  createdAt!: string
  updatedAt!: string

  static override tableName = 'agency_user'
  static override idColumn = ['user_id', 'agency_id']

  static override jsonSchema = {
    type: 'object',
    properties: {
      userId: { type: 'string', minLength: 36, maxLength: 36 },
      agencyId: { type: 'string', minLength: 36, maxLength: 36 },
      updatedBy: { type: 'string', minLength: 36, maxLength: 36 }
    }
  }

  static override relationMappings = {
    user: {
      relation: Model.HasOneRelation,
      modelClass: User,
      join: {
        from: 'agency_user.user_id',
        to: 'user.id'
      }
    },
    agency: {
      relation: Model.HasOneRelation,
      modelClass: Agency,
      join: {
        from: 'agency_user.agency_id',
        to: 'agency.id'
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

export const AgencyUserRW = AgencyUser.bindKnex(knexWrite)
export const AgencyUserRO = AgencyUser.bindKnex(knexReadOnly)

export default AgencyUser
