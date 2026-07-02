# Sistema de Monitoreo Costero - Protejamos Nuestro Mar

Este es un sistema web completo para la gestión de voluntariado ambiental en zonas costeras. Permite registrar y administrar jornadas de limpieza, voluntarios, zonas afectadas, fauna marina impactada, materiales de trabajo, basura recolectada y generar reportes de impacto ambiental.

¿Qué hace la aplicación?

La plataforma conecta a organizaciones ambientales con voluntarios para coordinar esfuerzos de limpieza y monitoreo de playas y zonas marinas. Los encargados pueden crear jornadas de limpieza, asignar voluntarios, registrar la basura recolectada por tipo y peso, documentar animales afectados por contaminación, gestionar el inventario de materiales y consultar reportes estadísticos del impacto ambiental.

Tecnologías utilizadas

El backend está construido con FastAPI (Python), usando SQLAlchemy como ORM para la base de datos MySQL. El frontend es una aplicación web estática desarrollada con HTML, CSS y JavaScript vanilla, sin frameworks de frontend, lo que la hace ligera y fácil de desplegar. La comunicación entre frontend y backend se realiza mediante una API REST con CORS habilitado para permitir el acceso desde el navegador.

Estructura del proyecto

El código se organiza en una arquitectura por capas dentro de la carpeta `app/`. Los modelos definen las entidades de la base de datos con SQLAlchemy. Los repositorios manejan el acceso directo a datos con operaciones CRUD. Los servicios contienen la lógica de negocio y validaciones. Los controladores exponen los endpoints de la API con FastAPI. Los esquemas de Pydantic validan los datos de entrada y salida. El frontend se encuentra en `web_voluntariado/` con sus páginas HTML, estilos CSS y scripts JavaScript organizados por módulo.

Módulos principales

El sistema cuenta con ocho módulos funcionales. El módulo de usuarios gestiona el acceso de encargados al sistema. El módulo de voluntarios registra datos personales y de contacto de los participantes. El módulo de zonas cataloga las áreas de trabajo según su nivel de contaminación. El módulo de jornadas programa las actividades de limpieza y permite asignar voluntarios. El módulo de basura recolectada registra el tipo y peso de los residuos. El módulo de fauna afectada documenta el estado de los animales encontrados. El módulo de materiales controla el inventario de herramientas y suministros. Finalmente, el módulo de reportes genera estadísticas consolidadas del impacto ambiental.

Cómo ejecutar el proyecto

Primero necesitas tener instalado Python 3.8 o superior y MySQL. Crea una base de datos llamada `oceano` y asegúrate de que las credenciales en `app/config/database.py` coincidan con tu configuración local. Instala las dependencias con `pip install fastapi uvicorn sqlalchemy pymysql pydantic bcrypt`. Luego ejecuta el servidor con `python main.py` o `uvicorn main:app --reload`. El backend estará disponible en `http://127.0.0.1:8000` y la documentación interactiva de la API en `http://127.0.0.1:8000/docs`. Para el frontend, puedes servir la carpeta `web_voluntariado/` con cualquier servidor estático como la extensión Live Server de VS Code, o acceder directamente a través de FastAPI montando los archivos estáticos en la ruta `/web`.

Características del frontend

Cada módulo tiene su propia página HTML con un formulario de registro, una tabla de datos y botones de acción. Los scripts JavaScript manejan el estado de edición mediante una variable que guarda el ID del registro seleccionado. Las tablas se renderizan dinámicamente consumiendo la API REST. Los mensajes de éxito y error aparecen como notificaciones tipo toast. La selección de filas en las tablas carga automáticamente los datos en el formulario para editar. El sistema incluye validaciones de campos en tiempo real antes de enviar los datos al servidor.

Autenticación

El login es sencillo: el usuario ingresa correo y contraseña, el backend valida las credenciales contra la base de datos, y si son correctas, guarda la información del usuario en el almacenamiento local del navegador. Las páginas del panel verifican esta sesión al cargar y redirigen al login si no hay usuario autenticado.

Estado del proyecto

Este es un proyecto funcional para fines académicos o de demostración. Las áreas de mejora incluyen la implementación de tokens JWT para una autenticación más segura, la configuración de variables de entorno para las credenciales de base de datos, la adición de paginación en las tablas para grandes volúmenes de datos, y la optimización de algunas rutas de archivos estáticos que actualmente están hardcodeadas.



# Describir el sistema
La creación de este proyecto nace porque los grupos y organizaciones que hacen limpiezas en las playas usualmente llevan todo el control en papel. Esto hace que sea muy difícil saber si tienen suficientes materiales para ese día, en qué parte de la playa acomodar a los voluntarios, o qué hacer con los datos de la basura que recogen.
Con este sistema, queremos apoyarlos con una herramienta en digital sencilla para que organicen mejor sus trabajos de limpieza. Al guardar de forma ordenada cuántos kilos de basura se recogen, la organización podrá sacar estadísticas de cuáles zonas están más contaminadas y así poder ver el impacto real de su trabajo.

Identificar módulos
Módulo de usuarios: Registrar usuarios, validar datos, controlar acceso.
Módulo de voluntarios: Registrar, consultar, listar voluntarios.
Módulo de limpieza: Registrar y consultar las zonas, sus voluntarios, las jornadas respectivas; materiales y la cantidad de basura almacenada.
Módulo fauna afectada: Registrar la especie, estado, consultar registros, generar reportes.

Definir entidades principales
Usuario (tipo encargado)
Voluntario
Zona
Jornada de limpieza
Materiales
Basura recolectada
Animales afectados













