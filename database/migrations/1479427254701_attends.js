'use strict'

const Schema = use('Schema')

class AttendsSchema extends Schema {

  up () {
    this.create('attends', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.integer('event_id').unsigned().references('id').inTable('events')
      table.timestamps()
    })
  }

  down () {
    this.drop('attends')
  }

}

module.exports = AttendsSchema
