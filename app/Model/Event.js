'use strict'

const Lucid = use('Lucid')

class Event extends Lucid {
    band(){
        return this.hasOne('App/Model/Band','band_id','id')
    }
}

module.exports = Event
