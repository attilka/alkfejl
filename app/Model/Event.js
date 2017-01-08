'use strict'

const Lucid = use('Lucid')
const Attend = use('App/Model/Attend')

class Event extends Lucid {
    band(){
        return this.hasOne('App/Model/Band','band_id','id')
    }

    * deleteEvent(){
        const attends = yield Attend.query().where('event_id', this.id).fetch()

       for (let attend of attends){
            yield attend.delete()
        }

        yield this.delete()
  }

  * attendBy(user_id){
        const attend=yield Attend.query().where('user_id',user_id).where('event_id',this.id).first()
        return attend ? true : false;
    }
}

module.exports = Event
