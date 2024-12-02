import { Model, snakeCaseMappers } from 'objection'
import Knex from 'knex'
import type { ColumnNameMappers } from 'objection'

import { formatToDBTimestamp } from '../utils/helpers'
import { writeConfig, readOnlyConfig } from '../knexfile'

const knexWrite = Knex(writeConfig)
const knexReadOnly = Knex(readOnlyConfig)

class UserSession extends Model {
  id!: string
  userId!: string
  userAgent!: string
  ipAddress!: string
  jti!: string
  createdAt!: string
  updatedAt!: string

  static override tableName = 'user_session'

  static override jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string', minLength: 36, maxLength: 36 },
      userId: { type: 'string', minLength: 36, maxLength: 36 },
      userAgent: { type: 'string', maxLength: 255 },
      ipAddress: { type: 'string', maxLength: 255 },
      jti: { type: 'string', maxLength: 32 }
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

export const UserSessionRW = UserSession.bindKnex(knexWrite)
export const UserSessionRO = UserSession.bindKnex(knexReadOnly)

export default UserSession
