import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ContactsWppPhones extends BaseSchema {
  protected tableName = 'contacts_wpp_phones'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table
        .integer('contact_id')
        .unsigned()
        .references('id')
        .inTable('contacts')
        .onDelete('CASCADE')
        .nullable()
      table
        .integer('wpp_phone_id')
        .unsigned()
        .references('id')
        .inTable('wpp_phones')
        .onDelete('CASCADE')
        .nullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
