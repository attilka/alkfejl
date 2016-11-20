'use strict'

const Schema = use('Schema')

class EventsSchema extends Schema {

  up () {
    this.create('events', (table) => {
      table.increments()
      table.integer('band_id').unsigned().references('id').inTable('bands')
      table.date('date', 80).notNullable()
      table.string('tickets', 80)
      table.string('description', 400)
      table.timestamps()
    })
  }

  down () {
    this.drop('events')
  }

}

module.exports = EventsSchema
