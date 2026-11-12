# 🎬 API de Películas y Medios

API RESTful construida con **Node.js** y **Express**, gestionando un catálogo de películas, series y demás contenido multimedia. La aplicación permite crear, leer, actualizar y eliminar (CRUD) recursos vinculados a relaciones con Géneros, Directores, Productoras y Tipos de Contenido.

---

## 📋 Índice

- [Características Principales](#características-principales)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Endpoints de la API](#endpoints-de-la-api)
- [Modelo de Datos](#modelo-de-datos)
- [Validaciones](#validaciones)
- [Ejemplos en Postman](#ejemplos-en-postman)

---

## 🌟 Características Principales

| Funcionalidad | Descripción |
|---------------|-------------|
| CRUD completo | Crear, leer, actualizar y eliminar contenidos multimedia |
| Relaciones integras | Vinculación con Géneros, Directores, Productoras y Tipos |
| Validaciones rigurosas | Verificación de datos obligatorios y referencias existentes |
| Conexión MySQL | Persistencia de datos en base de datos relacional |

---

## ⚙️ Requisitos Previos

- **Node.js** ≥ 18.x
- **MySQL** ≥ 5.7
- **Postman** (para pruebas manuales)

---

## 📦 Instalación

```bash
# Clonar o navegar al directorio del proyecto
cd "C:\Users\Julian\Documents\IU Digital Tareas\Proyecto Integrado II\tarea 1 final\API"

# Instalar dependencias
npm install

# Iniciar desarrollo con nodemon (reinicio automático)
npm run dev

# O iniciar el servidor directamente
npm start
```

---

## 🔧 Configuración

Crea un archivo `.env` en la raíz del proyecto con los siguientes datos de MySQL:

```ini
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_clave_mysql
DB_NAME=api_peliculas
```

---

## 📁 Estructura del Proyecto

```
API/
├── src/
│   ├── app.js              # Punto de entrada, configuración Express y rutas
│   ├── config/
│   │   └── database.js     # Pool de conexiones MySQL
│   ├── controllers/
│   │   └── mediaController.js  # Lógica de negocio para medios
│   └── routes/
│       └── mediaRoutes.js    # Definición de rutas de API
├── .env                     # Variables de entorno (MySQL credentials)
├── package.json             # Dependencias y scripts
└── README.md               # Este archivo
```

---

## 🔌 Endpoints de la API

### Base URL
```
http://localhost:3000/api/media
```

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/media` | Listar todos los contenidos multimedia |
| `GET` | `/media/:id` | Obtener detalle de un contenido por ID |
| `POST` | `/media` | Crear nuevo contenido multimedia |
| `PUT` | `/media/:id` | Actualizar contenido existente |
| `DELETE` | `/media/:id` | Eliminar contenido multimedia |

---

## 🗄️ Modelo de Datos (Tablas)

### Tabla: `media`

| Campo | Tipo | Descripción | Ejemplo |
|-------|------|-------------|---------|
| `id_media` | BIGINT(20) | Identificador único principal | 16 |
| `serial` | VARCHAR(50) | Código interno de referencia | "m1234" |
| `titulo` | VARCHAR(200) | Nombre/título de la película | "Juegos Del Silencio (2025)" |
| `sinopsis` | TEXT | Descripción del contenido | "Thriller psicológico en..." |
| `url` | VARCHAR(500) | Enlace al streaming/video | "https://.../video.mp4" |
| `portada` | VARCHAR(500) | URL de imagen portada | "https://.../poster.jpg" |
| `anio_estreno` | INT | Año de lanzamiento (1888-presente) | 2025 |
| `id_genero` | BIGINT(20) | Referencia a tabla genero | 1 |
| `id_director` | BIGINT(20) | Referencia a tabla director | 105 |
| `id_productora` | BIGINT(20) | Referencia a tabla productora | 43 |
| `id_tipo` | BIGINT(20) | Referencia a tabla tipo de contenido | 2 |

**Relaciones:**
- Un **Genero** puede tener múltiples películas/series (`1:N`)
- Un **Director** puede dirigir múltiples películas (`1:N`)
- Una **Productora** produce múltiples contenidos (`1:N`)
- Un **Tipo** clasifica el contenido (`1:N`)
- Cada **Media** tiene una referencia única a cada tabla (`N:1`)

---

## ✅ Validaciones

### Al crear/actualizar contenido:

1. **Campos Obligatorios:**
   - `serial`, `titulo`, `url`, `portada`
   - `anio_estreno`, `id_genero`, `id_director`, `id_productora`, `id_tipo`

2. **Validación de Año de Estreno:**
   ```javascript
   Mínimo: 1888 (primer año cinematográfico)
   Máximo: Año actual (2026)
   Tipo: Número entero
   ```

3. **Verificación de Relaciones:**
   - Cada referencia debe existir en su tabla correspondiente
   - El registro debe estar con estado `Activo` (para género, director, productora)

4. **Duplicados Evitados:**
   - No se permiten serials repetidos
   - No se permiten URLs duplicadas
   - Retorno: `409 Conflict` en caso de duplicado

---

## 🧪 Ejemplos en Postman

### 1️⃣ Crear una Película (POST /api/media)

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "serial": "m1234",
  "titulo": "Juegos Del Silencio (2025)",
  "sinopsis": "Thriller psicológico donde un grupo de vecinos enfrenta su pasado secreto.",
  "url": "https://video.example.com/juegos-silencio.mp4",
  "portada": "https://cdn.example.com/posters/juegos-silencio.jpg",
  "anio_estreno": 2025,
  "id_genero": 1,
  "id_director": 105,
  "id_productora": 43,
  "id_tipo": 2
}
```

**Respuesta Exitosa (201 Created):**
```json
{
  "mensaje": "Contenido multimedia creado correctamente",
  "id": "16"
}
```

---

### 2️⃣ Obtener Todas las Películas (GET /api/media)

**Headers:**
```
Accept: application/json
```

**Respuesta (JSON Array):**
```json
[
  {
    "id_media": 16,
    "serial": "m1234",
    "titulo": "Juegos Del Silencio (2025)",
    "sinopsis": "Thriller psicológico...",
    "url": "https://video.example.com/juegos-silencio.mp4",
    "portada": "https://cdn.example.com/posters/juegos-silencio.jpg",
    "anio_estreno": 2025,
    "id_genero": 1,
    "genero": "Thriller",
    "id_director": 105,
    "director": "Carlos Méndez",
    "id_productora": 43,
    "productora": "Studio Films",
    "id_tipo": 2,
    "tipo": "Película"
  },
  // ... más películas
]
```

---

### 3️⃣ Obtener Película por ID (GET /api/media/16)

**Respuesta (JSON Object):**
```json
{
  "id_media": 16,
  "serial": "m1234",
  "titulo": "Juegos Del Silencio (2025)",
  "sinopsis": "Thriller psicológico...",
  "url": "https://video.example.com/juegos-silencio.mp4",
  "portada": "https://cdn.example.com/posters/juegos-silencio.jpg",
  "anio_estreno": 2025,
  "id_genero": 1,
  "genero": "Thriller",
  "id_director": 105,
  "director": "Carlos Méndez",
  "id_productora": 43,
  "productora": "Studio Films",
  "id_tipo": 2,
  "tipo": "Película"
}
```

---

### 4️⃣ Actualizar Película (PUT /api/media/16)

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "serial": "m1234",
  "titulo": "Juegos Del Silencio (2025)",
  "sinopsis": "Nueva descripción mejorada del thriller psicológico.",
  "url": "https://video.example.com/juegos-silencio.mp4",
  "portada": "https://cdn.example.com/posters/juegos-silencio-actualizada.jpg",
  "anio_estreno": 2025,
  "id_genero": 1,
  "id_director": 105,
  "id_productora": 43,
  "id_tipo": 2
}
```

**Respuesta Exitosa (200 OK):**
```json
{
  "mensaje": "Contenido multimedia actualizado correctamente"
}
```

---

### 5️⃣ Eliminar Película (DELETE /api/media/16)

**Respuesta Exitosa (200 OK):**
```json
{
  "mensaje": "Contenido multimedia eliminado correctamente"
}
```

---

### 🔍 Pruebas de Errores

#### Caso de Error: Año Inválido
```json
{
  "serial": "m1234",
  "titulo": "Película del Futuro",
  "sinopsis": "Test para año inválido",
  "url": "https://video.example.com/pelicula.mp4",
  "portada": "https://cdn.example.com/poster.jpg",
  "anio_estreno": 2300,  // ❌ Fuera de rango (máx: 2026)
  "id_genero": 1,
  "id_director": 105,
  "id_productora": 43,
  "id_tipo": 2
}
```

**Respuesta (400 Bad Request):**
```json
{
  "mensaje": "El año de estreno no es válido"
}
```

---

#### Caso de Error: Relación Inexistente
```json
{
  "serial": "m1235",
  "titulo": "Película Test",
  "sinopsis": "",
  "url": "https://video.example.com/pelicula.mp4",
  "portada": "https://cdn.example.com/poster.jpg",
  "anio_estreno": 2025,
  "id_genero": 999,   // ❌ Género no existe
  "id_director": 105,
  "id_productora": 43,
  "id_tipo": 2
}
```

**Respuesta (400 Bad Request):**
```json
{
  "mensaje": "El género no existe o está inactivo"
}
```

---

## 📝 Consideraciones Técnicas

- **Framework:** Node.js + Express v5.3.0
- **Base de Datos:** MySQL con pool de conexiones (`mysql2/promise`)
- **Autenticación:** No implementada actualmente
- **API Design:** RESTful conventions estándar
- **Error Handling:** Código consistente (400, 404, 409, 500)
- **Formato de Respuestas:** JSON en todas las respuestas

---

## 🤝 Contribución

Si deseas agregar nuevas funcionalidades:

1. Crear controlador: `src/controllers/{nombre}Controller.js`
2. Definir rutas: `src/routes/{nombre}Routes.js`
3. Agregar tablas o relaciones al esquema de MySQL

---

## 📄 Licencia

Proyecto educativo - Proyecto Integrado II (2026)

---

**Versión:** 1.0.0  
**Última actualización:** Noviembre 2026
