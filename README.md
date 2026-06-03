# MateCode Tasks

SPA de gestion de tareas con React, TypeScript, Firebase Auth, Firestore, AWS SES y Vercel.

## Scripts

- `npm run dev`: servidor local de Vite.
- `npm run build`: chequeo TypeScript y build de produccion.
- `npm run test`: tests con Vitest.
- `npm run lint`: analisis con ESLint.
- `npm run vercel:dev`: ejecuta Vercel CLI localmente con funciones serverless.
- `npm run vercel:deploy`: despliegue preview en Vercel.
- `npm run vercel:prod`: despliegue de produccion en Vercel.

## Variables de entorno

Copia `.env.example` a `.env` y completa los valores de Firebase y AWS. Las variables `VITE_*` son las unicas expuestas al frontend; las variables de AWS deben usarse solo desde funciones serverless.

## Estructura

El proyecto esta organizado por capas: `components`, `pages`, `features`, `services`, `routes`, `api` y `tests`.

## Reporte por correo

El boton `Pedir reporte` esta disponible en Dashboard y Reportes. Actualmente llama a `/api/sendTasksSummary`, valida el payload y deja listo el punto de integracion serverless para AWS SES. El envio real por SES queda pendiente hasta activar credenciales y logica AWS.
