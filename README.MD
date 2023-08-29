## INSTALACION
```
npm install
```

## INSTALAR LIBRERIAS DE WHATSAPP
```
npm i whatsapp-web.js

npm install pg tls

npm install typeorm


npm install amqplib
npm install @types/amqplib --save-dev

npm install github:alechkos/whatsapp-web.js#fix-call-collection


documentación: https://wwebjs.dev/guide/#installation
```
## EJECUTAR EL PROGRAMA
```
npm run build
npm run dev
```
## DESDE DOCKER
```
docker run --privileged -e PORT=3001 -p 3001:3001 apiwhatsappts:latest
```
## DESDE POSTMAN
```
curl --location 'http://localhost:3001/lead' \
--header 'Content-Type: application/json' \
--data '{
    "message":"Hola, este es un mensaje de prueba del Laboratorio - soporte DAD, soy el bot de soporte",
    "phone":"51945699015"
}'
```