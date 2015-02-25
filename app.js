/**
* Module dependencies.
*/
var express = require('express');
var index = require('./routes/index');
var presentacion = require('./routes/presentacion');
var administracion = require('./routes/administracion');
var docencia = require('./routes/docencia');
var gestionInvestigacion = require('./routes/gestionInvestigacion');
var normativaLegal = require('./routes/normativaLegal');
var testSolicitudes = require('./routes/testSolicitudes');

var http = require('http');
var path = require('path');

var app = express();

// Cargamos la configuracion del archivo json y la exportamos para poder usarla en toda la aplicacion
var cargarConfig = require('./script/jsonReader');
config=cargarConfig("./config/config.json");
module.exports.config = config;

// Archivos de configuración de cada unas de las páginas
module.exports.personal = cargarConfig("./config/personal.json");
module.exports.infoEconomica = cargarConfig("./config/infoEconomica.json");
module.exports.servicios = cargarConfig("./config/servicios.json");
module.exports.ofertaDemanda = cargarConfig("./config/ofertaDemanda.json");
module.exports.claustro = cargarConfig("./config/claustro.json");
module.exports.estudiantes = cargarConfig("./config/estudiantes.json");

// All environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next){
  res.status(404).render('404_error', {titulo: config.error.titulo, texto: config.error.texto});
});

// Development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Inicio
app.get('/', index.index);
app.get('/index.html', index.index);

// Presentacion
app.get('/presentacion.html', presentacion.presentacion);

// Administracion
app.get('/personal.html',administracion.personal);
app.get('/infoEconomica.html',administracion.infoEconomica);
app.get('/servicios.html',administracion.servicios);
app.get('/perfilContratante.html',administracion.perfil);

// Docencia
app.get('/ofertaDemanda.html',docencia.ofertaDemanda);
app.get('/claustro.html',docencia.claustro);
app.get('/estudiantes.html',docencia.estudiantes);

// Gestion e investigación
app.get('/mision.html',gestionInvestigacion.mision);
app.get('/planEstrategico.html',gestionInvestigacion.planEstrategico);
app.get('/gobierno.html',gestionInvestigacion.gobierno);
app.get('/estadisticas.html',gestionInvestigacion.estadisticas);

// Normativa Legal
app.get('/normativaLegal.html',normativaLegal.normativaLegal);

// Solicitudes
app.get('/testSolicitudes.html', testSolicitudes.testSolicitudes);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
