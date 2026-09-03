# 📘 Manual Práctico de Nginx para Principiantes
## Guía Paso a Paso: Configuración, Registro de Sitios Web y Modificaciones

---

## 💡 1. ¿Qué es Nginx y cómo funciona?

**Nginx** (pronunciado *"Engine-X"*) es un servidor web ultrarrápido y ligero. Su función principal es recibir peticiones de navegadores en Internet (puertos `80` o `443`) y entregarles los archivos de tu página web (HTML, CSS, imágenes) o redirigirlos a una aplicación backend (Node.js, Python, etc.).

### 🖼️ Diagrama de Funcionamiento

```
                       ┌──────────────────────────────────────────────┐
                       │               SERVIDOR LINUX                 │
                       │                                              │
┌──────────────┐       │   ┌───────────────┐     ┌────────────────┐   │
│              │ HTTP  │   │               │─────▶ /var/www/sitio1│   │
│  Navegador   ├───────┼──▶│     NGINX     │     │ (HTML, CSS, JS)│   │
│   (Usuario)  │Port 80│   │ (VirtualHost) │     └────────────────┘   │
│              │       │   │               │     ┌────────────────┐   │
└──────────────┘       │   │               │─────▶ /var/www/sitio2│   │
                       │   └───────────────┘     │ (React / App)  │   │
                       │                         └────────────────┘   │
                       └──────────────────────────────────────────────┘
```

---

## 📂 2. Estructura de Archivos en Nginx (Ubuntu/Debian)

Cuando instalas Nginx, sus archivos clave se ubican en:

| Ruta de Archivo / Carpeta | Función |
|---|---|
| `/etc/nginx/nginx.conf` | Configuración global principal de Nginx |
| `/etc/nginx/sites-available/` | Donde creas los archivos de configuración de tus páginas |
| `/etc/nginx/sites-enabled/` | Carpeta con accesos directos (links) a los sitios **activos** |
| `/var/www/` | Carpeta estándar donde se alojan los archivos de tus páginas web |
| `/var/log/nginx/` | Dónde se guardan los archivos de registro (logs de errores y accesos) |

---

## 🚀 3. Paso a Paso: Cómo Registrar una Nueva Página Web

Imagina que quieres registrar un nuevo sitio web llamado `midominio.com`. Sigue estos 4 pasos sencillos:

```
PASO 1: Crear carpeta de archivos   ──▶ PASO 2: Crear configuración en Nginx
                                                    │
                                                    ▼
PASO 4: Recargar Nginx              ◀── PASO 3: Activar enlace simbólico
```

### Paso 1: Crear el directorio del sitio y subir tus archivos
Crea la carpeta donde vivirán tus HTML/CSS:
```bash
sudo mkdir -p /var/www/midominio.com
```
Copia los archivos de tu proyecto a esa carpeta:
```bash
sudo cp -r /ruta/de/tu/proyecto/* /var/www/midominio.com/
```
Asigna los permisos correctos:
```bash
sudo chown -R www-data:www-data /var/www/midominio.com
sudo chmod -R 755 /var/www/midominio.com
```

---

### Paso 2: Crear la configuración en Nginx (`sites-available`)
Crea un archivo de configuración para tu dominio:
```bash
sudo nano /etc/nginx/sites-available/midominio.com
```

Pega esta plantilla básica:

```nginx
server {
    listen 80;
    server_name midominio.com www.midominio.com;

    # Carpeta raíz donde están tus archivos
    root /var/www/midominio.com;
    index index.html index.htm;

    location / {
        # Intenta servir el archivo pedido, si no existe muestra index.html
        try_files $uri $uri/ =404;
    }

    # Configuración de Logs
    access_log /var/log/nginx/midominio.access.log;
    error_log /var/log/nginx/midominio.error.log;
}
```
*Guarda y cierra el archivo (`Ctrl + O`, `Enter`, `Ctrl + X`).*

---

### Paso 3: Activar el sitio (Enlace Simbólico en `sites-enabled`)
Para que Nginx reconozca la configuración, crea un enlace desde `sites-available` hacia `sites-enabled`:

```bash
sudo ln -s /etc/nginx/sites-available/midominio.com /etc/nginx/sites-enabled/
```

---

### Paso 4: Probar la sintaxis y recargar Nginx
**¡REGLA DE ORO!** Siempre verifica que la configuración no tenga errores de sintaxis antes de reiniciar:

```bash
# 1. Validar sintaxis
sudo nginx -t
```
*Si todo está bien verás: `syntax is ok` / `test is successful`.*

```bash
# 2. Recargar Nginx sin cortar las conexiones de los usuarios
sudo systemctl reload nginx
```

---

## 🔄 4. Cómo Realizar Modificaciones en tu Sitio Web

Cuando hagas cambios en tu código HTML, CSS, JavaScript o imágenes, el flujo de trabajo diario es muy sencillo:

### Flujo de Modificación Rápida:

```
   1. Edita el código en tu carpeta de desarrollo (~/dev/mi-proyecto)
                                │
                                ▼
   2. Copia los archivos actualizados a Nginx (/var/www/mi-sitio/)
                                │
                                ▼
   3. Refresca tu navegador (Ctrl + Shift + R para limpiar caché)
```

### Comando para actualizar producción rápidamente:
```bash
sudo cp -r ~/dev/WebTitandev/* /var/www/titandevdatadynamics/
```

*Nota:* Si solo cambias archivos estáticos (HTML/CSS/JS/imágenes), **NO necesitas reiniciar Nginx**, los cambios se reflejan inmediatamente en el navegador al refrescar.

---

## 🛠️ 5. Comandos Esenciales de Nginx

| Acción | Comando Terminal |
|---|---|
| **Ver estado de Nginx** | `sudo systemctl status nginx` |
| **Probar configuración** | `sudo nginx -t` |
| **Recargar cambios suaves** | `sudo systemctl reload nginx` |
| **Reiniciar servicio** | `sudo systemctl restart nginx` |
| **Ver logs de errores en vivo** | `sudo tail -f /var/log/nginx/error.log` |
| **Ver visitas en vivo** | `sudo tail -f /var/log/nginx/access.log` |

---

## 🌐 6. Cómo Alojar Múltiples Páginas en Nginx (Virtual Hosts)

Puedes alojar 2, 5 o 10 páginas web distintas en la misma máquina. Nginx sabrá a cuál dirigir al usuario leyendo el dominio que escribió en su navegador:

```
                          ┌────────────────────────┐
                          │     PETICIÓN HTTP      │
                          └───────────┬────────────┘
                                      │
                         ¿Qué nombre de dominio viene?
                                      │
               ┌──────────────────────┴──────────────────────┐
               ▼                                             ▼
   Host: titandevdatadynamics.com                Host: otrocliente.com
               │                                             │
               ▼                                             ▼
   Servir de:                                    Servir de:
   /var/www/titandevdatadynamics                 /var/www/otrocliente
```

Simplemente repites el **Paso 2 y Paso 3** creando un archivo nuevo en `sites-available` por cada dominio que tengas.

---

## ❓ Preguntas Frecuentes (FAQ)

### ¿Qué hago si al reiniciar la computadora Nginx no enciende solo?
Asegúrate de haber ejecutado este comando una sola vez:
```bash
sudo systemctl enable nginx
```

### ¿Qué hago si obtengo un error `403 Forbidden`?
Significa un problema de permisos. Ejecuta:
```bash
sudo chown -R www-data:www-data /var/www/tu-carpeta
sudo chmod -R 755 /var/www/tu-carpeta
```

### ¿Qué hago si obtengo un error `404 Not Found`?
Verifica que la directiva `root` en la configuración apunte exactamente a la carpeta donde está tu `index.html`.

---
*Manual redactado para el equipo de TitanDevDataDynamics.*
