'use strict'

const Event = use('App/Model/Event')
const Band = use('App/Model/Band')
const Attend = use('App/Model/Attend')
const Validator = use('Validator')
const Database = use('Database')

class EventController {

    * create (request, response) {
        yield response.sendView('eventCreate');
    }

    * doCreate (request, response) {
        const eventData = request.except('_csrf');

        const rules = {
        date: 'required'
        };

        const validation = yield Validator.validateAll(eventData, rules)

        if (validation.fails()) {
        yield request
            .withAll()
            .andWith({errors: validation.messages()})
            .flash()
        response.redirect('back')
        return
        }

        const band = yield Band.findBy('user_id', request.currentUser.id)

        eventData.band_id = band.id;
        //eventData.date=new Date(eventDate.date);
        const event = yield Event.create(eventData)
        // response.send(event.toJSON())
        response.redirect('/')
    }

    * search (request, response) {
    const page = Math.max(1, request.input('p'))
    const filter = request.input('filter')
    var subquery
    if( filter == 'bands')
        subquery = Database
            .from('likes')
            .where('user_id', request.currentUser.id)
            .select('band_id')

    if( filter == 'myevents')
        subquery = Database
            .from('attends')
            .where('user_id', request.currentUser.id)
            .select('event_id')

    const events = yield Event.query()
      .where(function () {
        this.where('date','>=',new Date().toJSON().substr(0,10))
        if (filter == 'bands') this.where('band_id','IN', subquery)
        if (filter == 'myevents') this.where('event_id', 'IN', subquery)
      })
      .with('band')
      .paginate(page, 9)

    yield response.sendView('eventSearch', {
      events: events.toJSON()
    })
  }

    * show (request, response) {
    const id = request.param('id');
    const event = yield Event.find(id);

    const attends = yield Attend.query().where('user_id', request.currentUser.id).where('event_id',id).first();

    yield event.related('band').load();

    if (attends) event.attends=1;

    yield response.sendView('eventShow', {
      event: event.toJSON()
    })
  }

  * attend(request, response){
      const id = request.param('id');

      const attends = yield Attend.query().where('user_id', request.currentUser.id).where('event_id',id).first();
      if (attends)
        yield attends.delete()
      else
        yield Attend.create({event_id: id, user_id: request.currentUser.id})

        response.redirect('/events/'+id)

  }

}

module.exports = EventController
