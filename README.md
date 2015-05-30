UGR Transparente
================

Portal de transparencia de la [UGR](http://www.ugr.es/) para publicar los datos y hacerlos accesibles y tratables. La aplicación web está diseñada en [Node.js](http://nodejs.org/) junto con [Express](http://expressjs.com/) y [Jade](http://jade-lang.com/). [Express](http://expressjs.com/) es un framework para desarrollar aplicaciones web mientras que [Jade](http://jade-lang.com/) es un módulo para trabajar con plantillas y poder implementar la arquitectura Modelo Vista Controlador.

La aplicación es accesible desde [http://transparente.ugr.es/](http://transparente.ugr.es).


## Instalación

1.- Lo primero es instalar **Node.js**. Para ello primero instalamos el paquete `python-software-properties` que nos permite añadir repositorios mediante el comando `add-apt-repository`. Seguidamente añadimos el repositorio para instalar **Node.js**, actualizamos la lista de paquetes e instalamos `nodejs`.


```
sudo apt-get install python-software-properties
sudo apt-add-repository ppa:chris-lea/node.js
sudo apt-get update && sudo apt-get install nodejs
```

Comprobamos que **Node.js** y **npm** (su gestor de paquetes) se han instalado correctamente.

```
node -v
npm -v
```

2.- Descargamos todo el contenido del repositorio para poder ejecutar la aplicación. Es preferible que siempre hagamos el clonado de un repositorio mediante SSH para lo que es necesario que primero hayamos subido nuestra clave SSH a GitHub. En la propia página de GitHub explican como hacerlo desde [aquí](https://help.github.com/articles/generating-ssh-keys/)

```
git clone git@github.com:oslugr/ugr-transparente-servidor.git
```

Si tuvieramos problemas con la conexión SSH, siempre podremos seguir haciéndolo mediante HTTPS:

```
git clone https://github.com/oslugr/ugr-transparente-servidor.git
```

3.- Nos situamos en el directorio de la aplicación (`ugr-transparente-servidor`) y procedemos a instalar todas las dependencias necesarias para la aplicación.

```
cd ugr-transparente-servidor
sudo npm install
```

Comprobamos también que las dependencias de todos los módulos se cumplen:

```
npm list --depth=0
```

4.- Para indicar el puerto que el servidor va a estar escuchando para resolver peticiones, deberemos modificarlo en el archivo `package.json`. Si vamos a instalar la aplicación en un servidor de acceso público tendremos que dejar obligatoriamente este puerto en el 80, ya que este es el puerto por defecto al que los navegadores harán las peticiones por defecto; pero como durante el desarrolllo trabajaremos habitualmente en local, y no se puede usar el puerto 80 porque es un puerto reservado, podríamos usar, por ejemplo,  el 3000, aunque este puerto se puede cambiar por cualquier otro que no esté reservado o en uso.
```
{
...
"scripts": {
  "start": "PORT=80 forever start -l /var/log/forever.log -a -o /var/log/out.log -e /var/log/err.log ./app.js",
...

}
```

5.- Para indicar la dirección IP donde accederemos, deberemos modificar la variable "ip" en el archivo `app.js`, se puede introducir tanto la dirección URL como la dirección IP pública (en nuestro caso hemos puesto la dirección URL a la que responderá nuestro servidor, `transparente.ugr.es`). Si estamos realizando una instalación local para pruebas, pondremos la dirección IP local: `127.0.0.1`.
```
...
app.set('ip', process.env.OPENSHIFT_NODEJS_IP || 'transparente.ugr.es');
...

```

6.- Arrancamos la aplicación mediante un script que hemos introducido en el archivo `package.json`. ¡Ojo! Cuando inicies la aplicación aparecerán los logs de registro en /var, por lo que es necesario ejecutar dicho script con permisos de superusuario.

```
sudo npm start
```

* Si se ha realizado la configuración para una instalación pública, al abrir el navegador y acceder a la dirección correspondiente (como es [http://transparente.ugr.es](http://transparente.ugr.es)), la aplicación debería estar funcionando para ser accesible desde cualquier lugar con acceso a internet.

* Si se ha realizado la configuración para una instalación local, al abrir un navegador y acceder a la dirección [http://localhost:3000](http://localhost:3000), la aplicación debería estar funcionando para ser accesible solo desde el entorno local.

7.- Cuando queramos detener el proceso tendremos que usar el script `kill` que hay en el archivo `package.json`.

```
sudo npm run-script kill
```


# Tests unitarios y de cobertura

Se han incluido tests unitarios para comprobar que las diferentes funcionalidades de la aplicación funcionan correctamente, de dichas funcionalidades hay que destacar el acceso a los archivos JSON con los datos del portal (para comprobar que existen y que los datos que contienen están en un formato válido) y que las diferentes páginas del portal son accesibles. También se ha creado un test de cobertura para comprobar que toda funcionalidad del portal está cubierta y asegurada por sus correspondientes test unitarios. Los test unitarios son realizados con [Mocha](https://github.com/mochajs/mocha) y el test de cobertura es realizado con [Istanbul](https://github.com/gotwarlost/istanbul). Se ejecutan con:

```
npm test
```

El resultado de los tests unitarios se mostrarán por pantalla como salida de la ejecución del script; a su vez, el resultado de los tests de cobertura se almacenarán en el archivo `coverage/lcov-report/index.html`, mostrando el porcentaje del código que está cubierto por los test unitarios.


# Integración continua

Disponemos de una integración continua que nos permite detectar automáticamente mediante la ejecución de pruebas los fallos que se produzcan cuando se actualiza el código, evitando así encontrarmos problemas inesperados durante el despliegue de la aplicación.

Para introducir la integración continua vamos a usar [Travis CI](https://travis-ci.org/). Para poder usarlo, activamos continua como explican en la propia [página](http://docs.travis-ci.com/user/getting-started/) de Travis CI, lo más importante es activar el uso de Travis para nuestro repositorio y crear el archivo de configuración `.travis.yml`.

A partir de ahora, con cada nuevo cambio que publiquemos en el repositorio del proyecto se generará una build del programa en Travis que ejecutará los scripts básicos de `npm`: `npm install` y `npm test`. Ya solo nos queda comprobar el resultado de estas [builds](https://travis-ci.org/oslugr/ugr-transparente-servidor/builds).
