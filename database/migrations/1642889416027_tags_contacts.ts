import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class TagsContacts extends BaseSchema {
  protected tableName = 'tags_contacts'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table
        .integer('tag_id')
        .unsigned()
        .references('id')
        .inTable('tags')
        .onDelete('CASCADE')
        .nullable()
      table
        .integer('contact_id')
        .unsigned()
        .references('id')
        .inTable('contacts')
        .onDelete('CASCADE')
        .nullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
