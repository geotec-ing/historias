# Historias GEOTEC

Convocatoria interna para que el equipo de GEOTEC comparta fotos, videos e historias de su trabajo para publicarlas en LinkedIn e Instagram.

Sitio: https://geotec-ing.github.io/historias/

## Qué hay aquí

- `index.html`: la página, con la ficha de 5 preguntas, la lista de revisión y la carga de fotos y videos.
- `config.js`: la dirección del receptor y el correo de la opción "Abrir mi correo". Es lo único que se edita para activar el envío.
- `img/`: fotos, logos e íconos de la página.
- `apps-script/Codigo.gs`: el receptor. No se ejecuta en GitHub: se copia en Google Apps Script.

## Dónde llega lo que envía la gente

Cada envío crea:

- una fila en la hoja de Google **Historias GEOTEC · postulaciones**, con nombre, área, correo, las 5 respuestas, el enlace a videos pesados y el estado;
- una subcarpeta con las fotos y videos dentro de la carpeta **Historias GEOTEC** de Google Drive;
- si se configura `AVISAR_A`, un correo con la ficha completa y las fotos o videos adjuntos (hasta 20 MB en total; si pesan más, el correo trae el enlace a la carpeta). Al responder ese correo le escribes directo a la persona, si dejó su correo.

Todo queda en el Drive de la cuenta de Google que pone en marcha el receptor. Lo ideal es una cuenta de GEOTEC.

La página también ofrece **enviar por correo**: arma un mensaje con la ficha en el programa de correo de la persona, y ella adjunta sus archivos. Aparece cuando hay un correo en `HISTORIAS_CORREO` dentro de `config.js`. Si todavía no está listo el receptor de Google, la página usa solo esta opción.

## Activar el envío

1. Entra a https://script.google.com con la cuenta de Google donde quieres recibir todo y crea un **Proyecto nuevo**. Ponle de nombre *Historias GEOTEC*.
2. Borra el contenido de `Código.gs` y pega todo el contenido de `apps-script/Codigo.gs`.
3. Para recibir cada historia en el correo, escribe tu correo en `AVISAR_A`, entre las comillas (varios correos van separados por coma). Guarda.
4. Arriba, elige la función `configurar` y pulsa **Ejecutar**. Google pide permisos: **Revisar permisos**, elige la cuenta y, si sale "Google no verificó esta app", entra a **Configuración avanzada** > **Ir a Historias GEOTEC** > **Permitir**. En el registro aparecen los enlaces de la carpeta y de la hoja.
5. Pulsa **Implementar** > **Nueva implementación** > tipo **Aplicación web**. En *Ejecutar como* deja **Yo** y en *Quién tiene acceso* elige **Cualquier usuario**. Pulsa **Implementar** y copia la URL de la aplicación web (termina en `/exec`).
6. En este repositorio, abre `config.js`, pulsa el lápiz, pega la URL en `HISTORIAS_ENDPOINT` y el correo de comunicaciones en `HISTORIAS_CORREO`, y guarda con **Commit changes**.
7. Espera uno o dos minutos, abre el sitio y haz un envío de prueba con una foto. Debe aparecer la fila en la hoja y la foto en Drive.

Si cambias el código del receptor, publica la nueva versión en **Implementar** > **Gestionar implementaciones** > lápiz > **Versión: nueva**. Así la URL no cambia.

## Límites

- Hasta 10 archivos por ficha y 30 MB por archivo. Para videos más pesados hay un campo para pegar un enlace de OneDrive, Drive o WeTransfer.
- La página no aparece en buscadores (`noindex`), pero cualquiera con el enlace puede abrirla y enviar.
