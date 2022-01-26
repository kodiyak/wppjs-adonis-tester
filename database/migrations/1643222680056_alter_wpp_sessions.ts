import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AlterWppSessions extends BaseSchema {
  protected tableName = 'wpp_sessions'

  public async up() {
    this.schema.table('wpp_sessions', (table) => {
      table
        .integer('wpp_phone_id')
        .unsigned()
        .references('id')
        .inTable('wpp_phones')
        .onDelete('CASCADE')
        .notNullable()
    })
  }

  public async down() {
    this.schema.table('wpp_sessions', (table) => {
      table.dropForeign('wpp_phone_id').dropColumn('wpp_phone_id')
    })
  }
}
