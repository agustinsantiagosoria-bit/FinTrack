# Publicar FinTrack en GitHub Pages

El proyecto queda preparado para publicarse desde el repositorio `agustinsantiagosoria-bit/FinTrack`. El workflow `.github/workflows/deploy.yml` compila la app y publica `dist` automáticamente al hacer push a `main`.

## 1. Configurar secretos de GitHub

En GitHub: **Settings → Secrets and variables → Actions → New repository secret**. Crear estos dos secretos usando los valores del proyecto Supabase (no subirlos al repositorio):

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

La clave `anon`/publishable es la que usa el navegador. Nunca usar `service_role` en el frontend ni como secreto de compilación.

## 2. Activar GitHub Pages

En GitHub: **Settings → Pages → Build and deployment → Source → GitHub Actions**.

## 3. Configurar Supabase Auth

En Supabase: **Authentication → URL Configuration**. Agregar la URL publicada a **Redirect URLs** y establecerla como **Site URL** cuando corresponda:

`https://agustinsantiagosoria-bit.github.io/FinTrack/`

Si se usan enlaces de confirmación de correo, revisar que las plantillas de email redirijan a la URL publicada.

## 4. Publicar

Hacer push de los cambios a la rama `main`. En **Actions** se podrá seguir el workflow. Cuando termine correctamente, la app quedará disponible en:

`https://agustinsantiagosoria-bit.github.io/FinTrack/`

## Notas

- El `base` de Vite está configurado como `/FinTrack/`, necesario para un repositorio de proyecto en GitHub Pages.
- La app usa Supabase para autenticación y datos; GitHub Pages solo aloja los archivos estáticos.
- Las políticas RLS de Supabase deben permanecer activas para aislar los datos por usuario.
- No subir `.env`, `service_role` ni credenciales privadas al repositorio.
