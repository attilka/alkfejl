'use strict'

const Route = use('Route')

Route.get('/', 'EventController.search')

Route.get('/bands/edit', 'BandController.edit').middleware('auth')
Route.post('/bands/edit', 'BandController.doEdit').middleware('auth')
Route.get('/bands', 'BandController.search').middleware('auth')
Route.get('/bands/delete', 'BandController.delete').middleware('auth')
Route.get('/bands/avatar', 'BandController.updateAvatar').middleware('auth')
Route.put('/bands/avatar', 'BandController.doUpdateAvatar').middleware('auth')
Route.get('/bands/:id', 'BandController.show')
Route.get('like/:id', 'BandController.like').middleware('auth')

Route.get('/events/create', 'EventController.create').middleware('auth')
Route.post('/events/create', 'EventController.doCreate').middleware('auth')
Route.get('/events/edit/:id', 'EventController.edit').middleware('auth')
Route.post('/events/edit/:id', 'EventController.doEdit').middleware('auth')
Route.get('/events/delete/:id', 'EventController.delete').middleware('auth')
Route.get('/events', 'EventController.search')
Route.get('/events/:id', 'EventController.show')
Route.get('attend/:id', 'EventController.attend').middleware('auth')

Route.get('/register', 'UserController.register')
Route.get('/login', 'UserController.login')
Route.post('/register', 'UserController.doRegister')
Route.post('/login', 'UserController.doLogin')
Route.get('/logout', 'UserController.doLogout')