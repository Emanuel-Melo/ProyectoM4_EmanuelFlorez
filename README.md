# Orion Task

**Aplicación SPA para gestión de tareas y reportes operativos con Firebase, AWS SES y despliegue en Vercel.**

**URL de producción:** https://proyecto-m4-emanuel-florez-8shgeq1ty.vercel.app/ 
## Descripción

Orion Task es una aplicación construida para pequeñas empresas que necesitan un tablero de tareas diario con persistencia por usuario, autenticación segura, sincronización en tiempo real y envío de reportes por email.

La aplicación permite:
- Autenticación con email/contraseña y Google.
- Registro, login y logout.
- Rutas protegidas para usuarios autenticados.
- CRUD completo de tareas asociadas a cada usuario.
- Sincronización en tiempo real en Firebase Firestore.
- Envío de resúmenes por email usando AWS SES a través de una función serverless.
- Acceso responsive desde móvil, tablet y desktop.

## Arquitectura

El proyecto está organizado por capas claras:

```
src/
├── app/             # Router y configuración principal
├── components/      # Componentes UI reutilizables
│   ├── auth/        # Formularios de autenticación
│   ├── dashboard/   # Componentes del dashboard
│   └── ui/          # Componentes base (Button, Input, Spinner)
├── context/         # AuthContext y estado global
├── features/        # Lógica por dominio (auth, dashboard)
├── hooks/           # Custom hooks reutilizables
├── routes/          # Rutas públicas y protegidas
├── services/        # Integraciones con Firebase y API email
├── types/           # Tipos e interfaces TypeScript
├── utils/           # Helpers y validaciones
└── styles/          # Estilos globales y utilidades

api/
└── sendTasksSummary.ts  # Función serverless Vercel para AWS SES

tests/
└── ...                 # Tests unitarios y de componentes
```

### Decisiones clave

- **React + TypeScript**: para seguridad de tipos y escalabilidad.
- **Context API**: para estado de autenticación global sin exceso de complejidad.
- **Firebase Auth + Firestore**: backend BaaS para acelerar el desarrollo y manejar persistencia del usuario.
- **Vercel Functions**: backend ligero para invocar AWS SES sin exponer credenciales.
- **Diseño mobile-first**: el layout se adapta a pantallas pequeñas con media queries.

## Flujo de la aplicación

### Autenticación

1. El usuario se registra o inicia sesión.
2. Firebase Auth mantiene la sesión activa.
3. `ProtectedRoute` bloquea rutas privadas hasta que la sesión esté lista.
4. Firebase `onAuthStateChanged` sincroniza el estado de usuario.

### CRUD de tareas

1. El dashboard suscribe el usuario a Firestore mediante `onSnapshot`.
2. Cada usuario ve únicamente sus tareas porque las reglas de Firestore verifican `userId === request.auth.uid`.
3. Crear, editar, completar y eliminar tareas actualiza Firestore y actualiza la UI en tiempo real.

### Envío de email

1. El usuario hace clic en `Pedir Reporte`.
2. El frontend envía un POST a `/api/sendTasksSummary` con el resumen de tareas.
3. La función Vercel valida el payload y llama a AWS SES.
4. AWS SES envía el email desde `AWS_SES_FROM_EMAIL`.
5. El frontend muestra éxito o un mensaje de error claro.

## Variables de Entorno

### Firebase (frontend)

Estas variables se usan en el cliente y deben llevar el prefijo `VITE_`.

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

### AWS SES (serverless)

Estas variables se usan solo en Vercel Functions y no deben exponerse en el frontend.

```
AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_SES_FROM_EMAIL=
```

### Instrucciones de setup

1. Copia `.env.example` a `.env`.
2. Completa las variables de Firebase.
3. Configura AWS SES y agrega las variables de producción en Vercel.
4. Asegúrate de que `.env` está en `.gitignore`.

## Reglas de seguridad de Firestore

El archivo `firestore.rules` protege datos por usuario:

```firestore-rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function signedIn() {
      return request.auth != null;
    }

    function ownsExistingDocument() {
      return signedIn() && resource.data.userId == request.auth.uid;
    }

    function ownsIncomingDocument() {
      return signedIn() && request.resource.data.userId == request.auth.uid;
    }

    match /tasks/{taskId} {
      allow read, update, delete: if ownsExistingDocument();
      allow create: if ownsIncomingDocument();
    }

    match /missions/{missionId} {
      allow read, update, delete: if ownsExistingDocument();
      allow create: if ownsIncomingDocument();
    }

    match /objectives/{objectiveId} {
      allow read, update, delete: if ownsExistingDocument();
      allow create: if ownsIncomingDocument();
    }

    match /scheduledTasks/{taskId} {
      allow read, update, delete: if ownsExistingDocument();
      allow create: if ownsIncomingDocument();
    }
  }
}
```

Estas reglas aseguran que:
- solo usuarios autenticados accedan a los datos,
- cada usuario solo lea y escriba sus propios documentos,
- tareas, misiones, objetivos y programación se mantengan aisladas.

## Tests

Se usa **Vitest** con **React Testing Library**.

```bash
npm run test
```

Los tests cubren:
- validación y manejo de errores en formularios de auth,
- funciones de servicio como `firebaseErrors` y `email.service`,
- comportamiento de componentes clave como `ReportRequestButton`,
- la función serverless `api/sendTasksSummary.ts`.

## Deploy

### Producción

- Deploy en Vercel: `npm run vercel:prod`
- URL pública: https://proyecto-m4-emanuel-florez-8shgeq1ty.vercel.app/ 

### Uso IA

Durante el desarrollo se usaron herramientas de IA como agentes de IA Codex y GitHub Copilot, y chats para desarrollo y recomendaciones como ChatGPT y Claude para acelerar la creación de componentes, mejorar la estructura del código y proponer soluciones para la integración con Firebase y AWS SES. Las sugerencias de IA se revisaron y adaptaron manualmente para mantener la calidad del proyecto.

### Variables en Vercel

Asegurarse de que en **Settings → Environment Variables** estén configuradas las variables servidor y frontend correctamente. En Vercel, `VITE_` es para frontend; las variables AWS no deben tener prefijo.

## Mejoras aplicadas

- Mejoras de responsive para pantallas móviles y tablet.
- Error handling más claro en login, registro, dashboard y envío de emails.
- Seguridad reforzada en Firestore Rules.
- UI optimizada para distintos tamaños de pantalla.

## Notas

- No se incluyeron filtros extra ni drag & drop, para mantener el alcance claro y estable.
- La documentación del uso de IA será completada por el autor del proyecto.

