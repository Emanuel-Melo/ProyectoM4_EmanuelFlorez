# MateCode Tasks

SPA de gestion de tareas con React, TypeScript, Firebase Auth, Firestore, AWS SES y Vercel.

## Scripts

- `npm run dev`: servidor local de Vite.
- `npm run build`: chequeo TypeScript y build de produccion.
- `npm run test`: tests con Vitest.
- `npm run lint`: analisis con ESLint.

## Variables de entorno

Copia `.env.example` a `.env` y completa los valores de Firebase y AWS. Las variables `VITE_*` son las unicas expuestas al frontend; las variables de AWS deben usarse solo desde funciones serverless.

## Estructura

El proyecto esta organizado por capas: `components`, `pages`, `features`, `services`, `hooks`, `types`, `utils`, `routes`, `functions` y `tests`.
