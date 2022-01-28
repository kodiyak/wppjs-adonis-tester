import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Workflows extends BaseSchema {
  protected tableName = 'workflows'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('title').nullable()
      table.string('description').nullable()
      table.uuid('uuid').index().notNullable()
      table.json('data').notNullable()
      table
        .integer('organization_id')
        .unsigned()
        .references('id')
        .inTable('organizations')
        .onDelete('CASCADE')
        .notNullable()
      table
        .integer('wpp_phone_id')
        .unsigned()
        .references('id')
        .inTable('wpp_phones')
        .onDelete('CASCADE')
        .notNullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('executed_at', { useTz: true })
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
