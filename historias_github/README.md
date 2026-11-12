# Historias GEOTEC

Convocatoria interna para que el equipo de GEOTEC comparta fotos, videos e historias de su trabajo para publicarlas en LinkedIn e Instagram.

Sitio: https://geotec-ing.github.io/historias/

## Qué hay aquí

- `index.html`: la página, con las fotos, las 5 preguntas, la lista de revisión y los botones de envío.
- `config.js`: el enlace del formulario y los correos. Es lo único que se edita.
- `img/`: fotos, logos e íconos.

## Cómo llegan las historias

1. **Formulario de Microsoft Forms**, creado con la cuenta practicante@geotecingenieria.com. Las respuestas quedan en Forms (y se pueden abrir en Excel) y las fotos y videos quedan en el OneDrive de esa cuenta, en `Aplicaciones > Microsoft Forms > Historias GEOTEC`. Para subir archivos, Forms exige que respondan personas de la organización, es decir, con cuenta de GEOTEC.
2. **Correo**: el botón "Abrir mi correo" arma un mensaje con las 5 preguntas para practicante@ y Claudia. Sirve para quien no tiene cuenta de GEOTEC.

## Crear el formulario (una sola vez)

Entra a https://forms.office.com con la cuenta practicante@geotecingenieria.com y crea un **Nuevo formulario** llamado **Historias GEOTEC**. Agrega estas preguntas:

| Pregunta | Tipo | Obligatoria |
|---|---|---|
| Tu área | Opción: Componente biótico, Componente físico, Componente social, SIG y cartografía, HSEQ, Laboratorio, InnoLab, Comercial, Administrativa y financiera, Otra | Sí |
| ¿Qué material tienes? | Opción con varias respuestas: Fotos, Video, Dato o herramienta, Reto resuelto, Logro o evento, El equipo | No |
| 1. ¿Qué hicimos? | Texto, respuesta larga | Sí |
| 2. ¿En qué tipo de proyecto o proceso? (sin nombre del cliente) | Texto, respuesta larga | No |
| 3. ¿Qué reto resolvimos? | Texto, respuesta larga | No |
| 4. ¿Qué aprendimos o qué dato vale la pena contar? | Texto, respuesta larga | No |
| 5. ¿Quién participó? | Texto, respuesta larga | No |
| ¿Cuándo pasó? | Fecha | No |
| Fotos y videos | Cargar archivo (en "Más tipos de preguntas"): 10 archivos, 1 GB por archivo, tipos Imagen y Video | No |
| Enlace a videos más pesados | Texto | No |
| Revisé que las personas que aparecen están de acuerdo, que no hay datos de clientes ni ubicaciones sensibles y que son archivos originales | Opción con una sola respuesta: "Sí, lo revisé" | Sí |

En **Configuración** (los tres puntos de arriba):

- Marca **Solo las personas de mi organización pueden responder** y **Registrar nombre**. Así no hace falta preguntar el nombre.
- Marca **Obtener una notificación por correo electrónico de cada respuesta**.

Para que Claudia también reciba cada historia, en el Outlook de practicante crea una regla que reenvíe a claudia.mejia@geotecingenieria.com los correos de Microsoft Forms que digan "Historias GEOTEC". Otra opción es compartirle el formulario para colaborar, y así ve las respuestas.

## Conectar el formulario con la página

1. En Forms, pulsa **Recopilar respuestas** y **Copiar vínculo**.
2. En este repositorio abre `config.js`, pulsa el lápiz, pega el vínculo entre las comillas de `HISTORIAS_FORMULARIO` y pulsa **Commit changes**.
3. Espera uno o dos minutos y prueba el botón **Abrir el formulario** con una foto.

Mientras `HISTORIAS_FORMULARIO` esté vacío, la página funciona solo con la opción de correo.
