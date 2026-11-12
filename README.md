# Historias GEOTEC

Convocatoria interna para que todas las áreas de GEOTEC compartan fotos, videos e ideas de su trabajo para publicarlas en LinkedIn e Instagram.

Sitio: https://geotec-ing.github.io/historias/

## Qué hay aquí

- `index.html`: la página, con las animaciones y los botones que llevan al formulario.
- `config.js`: el enlace del formulario y los correos. Es lo único que se edita.
- `img/`: fotos, logos e íconos.

Estos archivos van en la raíz del repositorio, no dentro de otra carpeta. Si quedan dentro de una carpeta, GitHub Pages da error 404.

## Cómo llegan las historias

1. **Formulario de Microsoft Forms** (Historias GEOTEC), creado con la cuenta practicante@geotecingenieria.com. Las respuestas quedan en Forms (se abren en Excel) y los archivos en el OneDrive de esa cuenta, en `Aplicaciones > Microsoft Forms > Historias GEOTEC`.
2. **Correo**: si alguien no puede entrar con su cuenta, el botón "Abrir mi correo" arma un mensaje con las preguntas para practicante@ y Claudia.

## Cambiar el enlace del formulario

1. Abre `config.js`, pulsa el lápiz y pega el vínculo entre las comillas de `HISTORIAS_FORMULARIO`.
2. Pulsa **Commit changes**.
3. Espera unos minutos. GitHub Pages tarda en publicar y el navegador puede guardar la versión anterior hasta 10 minutos. Para comprobarlo, abre la página en una ventana de incógnito.

Si `HISTORIAS_FORMULARIO` queda vacío, los botones abren el correo con las preguntas listas.
