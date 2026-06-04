# 🎯 Orion Task - Centro de Mando de Tareas

**Aplicación SPA (Single Page Application) para gestión de tareas, misiones y objetivos operativos con autenticación de usuarios, persistencia en la nube y envío de reportes por email.**

> Desarrollado por: **Emanuel Florez** | Proyecto Integrador 4 - MateCode Bootcamp

---

## 📋 Descripción del Proyecto

**Orion Task** es una solución empresarial diseñada para pequeñas empresas que necesitan centralizar la gestión de tareas diarias de sus empleados. La aplicación permite:

- ✅ **Autenticación segura**: Registro e inicio de sesión con email/contraseña o Google
- ✅ **Gestión completa de tareas**: Crear, editar, eliminar y marcar tareas como completadas
- ✅ **Misiones y objetivos**: Organizar tareas en misiones con seguimiento de progreso
- ✅ **Persistencia en la nube**: Todos los datos sincronizados en Firebase Firestore
- ✅ **Reportes por email**: Envío automático de resúmenes operativos mediante AWS SES
- ✅ **Acceso desde cualquier dispositivo**: Aplicación responsive y accesible desde móvil, tablet y desktop
- ✅ **Sincronización en tiempo real**: Cambios inmediatos sin recargar la página

### Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| **Frontend** | React 19 + TypeScript + React Router 7 |
| **Styling** | CSS3 (Flexbox/Grid) |
| **Backend (BaaS)** | Firebase Authentication + Firestore |
| **Notificaciones** | AWS SES (Simple Email Service) |
| **Serverless** | Vercel Functions |
| **Testing** | Vitest + React Testing Library |
| **Build** | Vite 8 |
| **Deploy** | Vercel |

---

## 🏗️ Decisiones Arquitectónicas

### 1. **Separación por Capas (Layered Architecture)**

El proyecto está organizado en capas claras según responsabilidad:

```
src/
├── pages/           # Vistas principales (Login, Register, Dashboard)
├── components/      # Componentes UI reutilizables
│   ├── auth/       # Componentes de autenticación
│   ├── dashboard/  # Componentes del dashboard
│   ├── tasks/      # Componentes específicos de tareas
│   └── ui/         # Componentes base (Button, Input, Spinner)
├── features/        # Lógica de negocio por dominio
│   ├── auth/       # Servicios y tipos de autenticación
│   └── dashboard/  # Servicios y tipos de dashboard
├── context/         # Estado global (AuthContext)
├── hooks/          # Custom hooks reutilizables
├── routes/         # Configuración de rutas y ProtectedRoute
├── services/       # Integraciones externas (Firebase, Email)
├── types/          # Interfaces y tipos compartidos
├── utils/          # Funciones auxiliares (validaciones, formateo)
├── styles/         # Estilos globales
└── app/            # Configuración de la aplicación (Router)

api/
└── sendTasksSummary.ts  # Vercel Serverless Function para envío de emails

tests/
├── *.test.tsx      # Tests de componentes
└── mocks/          # Mocks de servicios externos
```

**Ventajas:**
- Fácil de navegar y entender
- Escalable: agregar nuevas features es predecible
- Testing: cada capa se prueba de forma aislada
- Mantenibilidad: cambios localizados por responsabilidad

### 2. **Context API para Gestión de Estado**

Se usa `AuthContext` para gestionar el estado de autenticación de forma global:

```typescript
// El contexto proporciona:
- user: User | null          // Usuario autenticado
- loading: boolean           // Estado de carga inicial
- register(): Promise<void>  // Registro con email/password
- login(): Promise<void>     // Login con email/password
- loginWithGoogle(): Promise<void>  // Login con Google
- logout(): Promise<void>    // Cerrar sesión
```

**Por qué Context en lugar de Redux:**
- Aplicación mediana con estado relativamente simple
- Context API es suficiente para esta complejidad
- Menos boilerplate, más rápido de prototipar
- Firebase maneja la persistencia (no necesitamos middleware)

### 3. **Firestore como Fuente de Verdad**

Los datos de tareas, misiones y objetivos se sincronizan en **tiempo real** usando `onSnapshot`:

```typescript
// Cada cambio en Firestore se refleja automáticamente en la UI
const unsubscribe = onSnapshot(
  query(collection(db, "scheduledTasks"), where("userId", "==", userId)),
  (snapshot) => {
    // Los datos se actualizan sin necesidad de recargar
  }
);
```

**Ventajas:**
- Sincronización bidireccional automática
- No hay inconsistencias entre cliente y servidor
- Escalable: múltiples usuarios ven cambios en tiempo real
- Offline-ready: con configuración adicional

### 4. **Funciones Serverless para Operaciones Sensibles**

AWS SES se invoca **únicamente desde una función serverless** en Vercel:

```
Frontend (React)
       ↓ (POST /api/sendTasksSummary)
Vercel Function (api/sendTasksSummary.ts)
       ↓ (credenciales AWS de servidor)
AWS SES
       ↓
Email enviado
```

**Por qué no llamar SES directamente desde frontend:**
- ❌ Exposición de credenciales AWS en el cliente (riesgo de seguridad)
- ❌ Costos incontrolables (cualquiera podría hacer spam)
- ❌ Violación de CORS (AWS SES no permite origen navegador)
- ✅ La función serverless es intermediaria segura

### 5. **Firestore Security Rules**

Las reglas de seguridad **protegen los datos por usuario**:

```firestore-rules
match /scheduledTasks/{taskId} {
  allow read, update, delete: if resource.data.userId == request.auth.uid;
  allow create: if request.resource.data.userId == request.auth.uid;
}
```

**Garantiza:**
- Cada usuario solo ve/edita sus propias tareas
- Imposible acceder a datos de otros usuarios, incluso si conoces el ID
- No hay necesidad de filtrado en frontend

### 6. **Variables de Entorno Seguras**

```javascript
// ✅ Frontend (VITE_* expuestas al navegador)
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID

// ✅ Serverless (solo en funciones, NO en frontend)
AWS_REGION
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_SES_FROM_EMAIL
```

**Separación crítica:**
- Las claves de Firebase se necesitan en el frontend (inicialización de SDK)
- Las credenciales AWS **nunca** llegan al navegador (solo en servidor)

---

## 📦 Instalación y Setup

### Requisitos Previos

- Node.js 18+
- npm o yarn
- Git
- Cuenta de Firebase (gratuita)
- Cuenta de AWS (con SES habilitado)

### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/tuusuario/proyecto-m4.git
cd proyecto-m4
```

### Paso 2: Instalar Dependencias

```bash
npm install
```

### Paso 3: Configurar Variables de Entorno

1. Copia el archivo de ejemplo:
```bash
cp .env.example .env
```

2. Abre `.env` y completa los valores (ver sección [Variables de Entorno](#variables-de-entorno) abajo)

3. **Verifica que `.env` está en `.gitignore`** (no debe subirse al repositorio)

### Paso 4: Ejecutar Localmente

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Paso 5: Probar Authentication

1. Navega a `http://localhost:5173/register`
2. Crea una cuenta con email y contraseña
3. Verifica que la sesión persista al recargar
4. Prueba logout y login nuevamente

---

## 🔐 Variables de Entorno

### Firebase Configuration (variables VITE_*)

Obtén estos valores en [Firebase Console](https://console.firebase.google.com):

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `VITE_FIREBASE_API_KEY` | Clave pública de Firebase | `AIzaSy...` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Dominio de autenticación | `tu-proyecto.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | ID del proyecto Firebase | `tu-proyecto-12345` |
| `VITE_FIREBASE_STORAGE_BUCKET` | Bucket de almacenamiento | `tu-proyecto.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | ID del remitente de mensajes | `123456789` |
| `VITE_FIREBASE_APP_ID` | ID de la aplicación | `1:123456789:web:abc...` |

### AWS SES Configuration (variables serverless)

Obtén estos valores en [AWS Console](https://console.aws.amazon.com):

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `AWS_REGION` | Región de AWS (donde está SES) | `us-east-1` |
| `AWS_ACCESS_KEY_ID` | Access Key ID de usuario IAM | `AKIA...` |
| `AWS_SECRET_ACCESS_KEY` | Secret Access Key (⚠️ NUNCA en git) | `wJa...` |
| `AWS_SES_FROM_EMAIL` | Email remitente verificado en SES | `noreply@tuempresa.com` |

### Cómo obtener estas variables

#### Firebase:
1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Selecciona tu proyecto
3. Haz clic en ⚙️ Settings → Project Settings
4. Copia los valores en "Your apps" → "SDK setup and configuration"

#### AWS SES:
1. Ve a [AWS Console](https://console.aws.amazon.com)
2. Abre **SES** (Simple Email Service)
3. Ve a **SMTP Credentials** o crea un usuario IAM con política `AmazonSESFullAccess`
4. Verifica que al menos un email esté en "Verified identities"

---

## 🚀 Scripts Disponibles

### Desarrollo

```bash
# Servidor local con hot-reload
npm run dev

# Ejecutar tests en modo watch
npm run test

# Linter (ESLint)
npm run lint

# Build de producción
npm run build

# Preview del build (simula producción local)
npm run preview
```

### Vercel (Serverless Functions)

```bash
# Ejecuta local con soporte para Vercel Functions
npm run vercel:dev

# Deploy a preview (rama)
npm run vercel:deploy

# Deploy a producción (main)
npm run vercel:prod
```

---

## 📊 Flujo de Envío de Emails

### Diagrama del Flujo

```
┌─────────────────────────────────────────────────────────────────┐
│ Usuario en Dashboard / Reportes                                 │
└────────────────────────┬────────────────────────────────────────┘
                         │ Click en "Pedir Reporte"
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│ ReportRequestButton.tsx                                         │
│ - Valida email del operador                                    │
│ - Recopila datos: tareas, misiones, objetivos                │
│ - Calcula score de eficiencia (40% misiones + 30% objetivos  │
│                                + 30% tareas)                  │
└────────────────────────┬────────────────────────────────────────┘
                         │ POST /api/sendTasksSummary
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│ Vercel Function (api/sendTasksSummary.ts)                      │
│ - Valida payload (email, tareas, misiones, objetivos)          │
│ - Verifica que los datos no estén vacíos                        │
│ - Construye objeto ReportPayload                               │
└────────────────────────┬────────────────────────────────────────┘
                         │ Llama AWS SES
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│ AWS SES (Simple Email Service)                                  │
│ - Autentica con credenciales de servidor (no expuestas)        │
│ - Renderiza plantilla de email HTML                            │
│ - Envía desde AWS_SES_FROM_EMAIL                               │
│ - Retorna MessageId o error                                    │
└────────────────────────┬────────────────────────────────────────┘
                         │ Respuesta 200 + MessageId
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│ Frontend recibe respuesta                                       │
│ - Muestra confirmación "Email enviado exitosamente"            │
│ - Toast/Notificación con timestamp                             │
└─────────────────────────────────────────────────────────────────┘
```

### Flujo Técnico Detallado

**1. Frontend - ReportRequestButton**
```typescript
// Recopila datos del dashboard
const payload = {
  to: operatorEmail,
  operatorName: operatorName,
  reportScore: reportScore,
  missions: missions,
  objectives: objectives,
  tasks: tasks
};

// Envia a la función serverless
const response = await fetch('/api/sendTasksSummary', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
});
```

**2. Vercel Function - sendTasksSummary.ts**
```typescript
// 1. Valida que sea POST
// 2. Valida email con regex
// 3. Valida que los arrays existan y tengan elementos
// 4. Retorna 202 Accepted (procesamiento asíncrono)
// 5. Llama a AWS SES (credenciales desde env variables)
```

**3. AWS SES - Envío de Email**
```typescript
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const sesClient = new SESClient({ region: process.env.AWS_REGION });
const params = {
  Source: process.env.AWS_SES_FROM_EMAIL,
  Destination: { ToAddresses: [email] },
  Message: {
    Subject: { Data: `Reporte Operativo - ${fecha}` },
    Body: { Html: { Data: htmlTemplate } } // Plantilla renderizada
  }
};

await sesClient.send(new SendEmailCommand(params));
```

### Limitaciones Actuales

⚠️ **En desarrollo (sandbox mode):**
- Solo puedes enviar emails a direcciones **verificadas** en AWS SES
- Máximo 1 email por segundo
- No hay límite de emails totales (pero cuenta limitada)

✅ **En producción (con aprobación de AWS):**
- Puedes enviar a cualquier dirección
- Aumentan los límites de velocidad
- Disponible full SES capabilities

---

## 🧪 Testing

### Ejecutar Tests

```bash
# Tests en modo watch (recomendado para desarrollo)
npm run test

# Tests una sola vez
npm run test -- --run

# Tests con cobertura
npm run test -- --coverage

# Tests de un archivo específico
npm run test -- src/components/auth/LoginForm.test.tsx
```

### Estructura de Tests

Los tests están en `tests/` y siguen esta estructura:

```
tests/
├── setup.ts                      # Configuración global (jest-dom, mocks)
├── mocks/
│   └── firebase.mock.ts          # Mocks de Firebase Auth y Firestore
├── components/
│   ├── LoginForm.test.tsx        # Tests de componentes
│   ├── TasksSection.test.tsx
│   └── ...
├── services/
│   ├── firebaseErrors.test.ts    # Tests de servicios
│   └── emailService.test.ts
└── api/
    └── sendTasksSummary.test.ts  # Tests de funciones serverless
```

### Ejemplo de Test

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from '../src/components/auth/LoginForm';

describe('LoginForm', () => {
  it('debería mostrar error si email inválido', async () => {
    render(<LoginForm />);
    
    const emailInput = screen.getByPlaceholderText(/correo/i);
    await userEvent.type(emailInput, 'email-invalido');
    
    const submitButton = screen.getByRole('button', { name: /iniciar/i });
    await userEvent.click(submitButton);
    
    expect(screen.getByText(/formato válido/i)).toBeInTheDocument();
  });
});
```

### Mocks de Firebase

Para no hacer llamadas reales a Firebase en tests:

```typescript
// mocks/firebase.mock.ts
vi.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChanged: vi.fn((auth, callback) => {
    callback(null); // Usuario no autenticado
    return () => {}; // unsubscribe
  })
}));
```

---

## 🌐 Deploy en Vercel

### Paso 1: Conectar Repositorio

1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Click en "Add New..." → "Project"
3. Selecciona "Import Git Repository"
4. Elige tu repositorio de GitHub
5. Vercel detectará automáticamente que es un proyecto Vite + React

### Paso 2: Configurar Variables de Entorno

En Vercel, ve a **Settings → Environment Variables** y añade:

**Frontend (VITE_*):**
```
VITE_FIREBASE_API_KEY = AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN = tu-proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID = tu-proyecto-12345
VITE_FIREBASE_STORAGE_BUCKET = tu-proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID = 123456789
VITE_FIREBASE_APP_ID = 1:123456789:web:abc...
```

**Serverless (AWS):**
```
AWS_REGION = us-east-1
AWS_ACCESS_KEY_ID = AKIA...
AWS_SECRET_ACCESS_KEY = wJa... (⚠️ sensible)
AWS_SES_FROM_EMAIL = noreply@tuempresa.com
```

### Paso 3: Deploy

```bash
# Primera vez (preview)
npm run vercel:deploy

# Producción
npm run vercel:prod
```

O simplemente haz un `git push` a main y Vercel hace deploy automático.

### Paso 4: Probar en Producción

1. Obtén la URL de producción desde Vercel dashboard
2. Prueba flujo completo:
   - ✅ Registro e login
   - ✅ Crear/editar tareas
   - ✅ Enviar email de reporte
   - ✅ Logout

### Troubleshooting Deploy

| Problema | Solución |
|----------|----------|
| Vercel Functions devuelve 500 | Revisa logs en Vercel → Functions → Logs |
| Variables de entorno no se ven | Asegúrate que están en las 3 environments (Development, Preview, Production) |
| CORS error en email | Verifica que la función serverless existe en `api/sendTasksSummary.ts` |
| Firebase no se conecta | Comprueba que `VITE_*` variables están correctas |

---

## 🤖 Uso de IA en el Desarrollo

### Contexto de Uso

Este proyecto fue desarrollado con apoyo de **GitHub Copilot** y **Claude AI**, priorizando siempre la **comprensión del código** sobre la velocidad de desarrollo.

### Patrones Utilizados

#### 1. **Solicitar pasos antes de código**
```
"Necesito implementar el CRUD de tareas en Firestore. 
Dame los pasos que debo seguir antes de escribir código."
```
**Resultado:** Obtener un plan claro evita decisiones de arquitectura equivocadas.

#### 2. **Pedir ejemplos mínimos**
```
"Muéstrame el ejemplo más simple de onSnapshot con 
un where clause para filtrar por userId."
```
**Resultado:** Código limpio y enfocado, sin abstracciones innecesarias.

#### 3. **Comparar con documentación oficial**
```
"Generaste este código de Firebase. ¿Es idéntico a los ejemplos 
en la documentación oficial? ¿Hay mejores prácticas?"
```
**Resultado:** Código alineado con estándares.

#### 4. **Escribir tests para validar**
```
"Genera un test simple que valide que el email se envía 
correctamente al hacer POST a /api/sendTasksSummary."
```
**Resultado:** Confianza de que el código funciona.

#### 5. **Revisar decisiones arquitectónicas**
```
"¿Debería usar Context API o Redux para Auth? 
¿Cuál es mejor para un proyecto mediano?"
```
**Resultado:** Decisiones técnicas justificadas.

### Cómo se integró IA en el proceso

| Fase | Uso de IA | Enfoque |
|------|-----------|---------|
| **Planificación** | Brainstorming de arquitectura | Generar opciones, elegir conscientemente |
| **Implementación** | Code generation con revisión | Generar fragmentos, entender cada línea |
| **Testing** | Crear tests y mocks | Generar templates, adaptar a casos reales |
| **Debugging** | Analizar errores | Entender raíz del problema, no solo fix |
| **Documentación** | Redacción inicial de README | Editar y adaptar al proyecto real |

### Lo que sí funcionó bien

✅ **Generar estructura de carpetas** - IA entiende patrones de proyecto  
✅ **Tipos TypeScript** - IA es excelente generando interfaces  
✅ **Tests unitarios** - IA puede crear buenos test templates  
✅ **Componentes reutilizables** - IA aprende patrones de React  
✅ **Traducción a español** - IA mantiene tono y contexto  

### Lo que requirió revisión manual

⚠️ **Security rules de Firestore** - Debe validarse manualmente  
⚠️ **Configuración de AWS SES** - Contexto específico de cada empresa  
⚠️ **Estilos CSS** - Necesitaban ajustes de diseño  
⚠️ **Nombres de variables** - A veces genéricos, no específicos del dominio  

### Reflexión sobre el uso responsable

> La IA fue una **herramienta de productividad**, no un sustituto del pensamiento crítico.
> 
> - Cada decisión arquitectónica fue validada contra la documentación oficial.
> - El código fue testeado antes de considerarlo "completo".
> - Se leyó y entendió cada línea generada por IA.
> - Se documentó el "por qué" de cada componente, no solo el "qué".

---

## 📁 Estructura de Archivos Explicada

### `/src/pages`
Vistas principales, cada una corresponde a una ruta:
- `LoginPage.tsx` - Formulario de login
- `RegisterPage.tsx` - Formulario de registro
- `DashboardPage.tsx` - Vista principal con tareas, misiones, objetivos

### `/src/components`
Componentes UI reutilizables organizados por contexto:

**`/auth`** - Componentes de autenticación
- `LoginForm.tsx` - Formulario logineable
- `RegisterForm.tsx` - Formulario de registro

**`/dashboard`** - Componentes del dashboard
- `sections/` - Secciones principales (TasksSection, MissionsSection, etc.)
- `CardHeader.tsx` - Header reutilizable para tarjetas
- `Metric.tsx` - Métrica de estadísticas
- `ReportRequestButton.tsx` - Botón para solicitar reporte

**`/ui`** - Componentes base
- `Button.tsx` - Botón reutilizable
- `Input.tsx` - Input reutilizable
- `Spinner.tsx` - Indicador de carga

### `/src/features`
Lógica de negocio por dominio (Feature-based):

**`/auth`**
- `auth.service.ts` - Servicios de autenticación
- `auth.utils.ts` - Utilidades de auth

**`/dashboard`**
- `dashboard.service.ts` - CRUD de tareas, misiones, objetivos
- `dashboard.types.ts` - Interfaces (Task, Mission, Objective)
- `dashboard.data.ts` - Datos demo

### `/src/context`
Estado global:
- `AuthContext.tsx` - Contexto de autenticación con provider

### `/src/hooks`
Custom hooks reutilizables:
- `useAuth.ts` - Hook para acceder al contexto de auth

### `/src/services`
Integraciones con servicios externos:
- `firebase.ts` - Inicialización de Firebase
- `email.service.ts` - Integración con AWS SES

### `/src/utils`
Funciones auxiliares:
- `firebaseErrors.ts` - Mapeo de errores de Firebase a mensajes en español

### `/api`
Vercel Serverless Functions:
- `sendTasksSummary.ts` - Función para enviar emails con resumen de tareas

### `/tests`
Tests unitarios y de componentes:
- `setup.ts` - Configuración global (jest-dom, mocks)
- `mocks/firebase.mock.ts` - Mocks de Firebase

---

## 🔗 Recursos Útiles

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/start)
- [AWS SES Documentation](https://docs.aws.amazon.com/ses/)
- [React Testing Library](https://testing-library.com/react)
- [Vercel Functions](https://vercel.com/docs/concepts/functions/serverless-functions)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 📞 Contacto y Soporte

**Desarrollador:** Emanuel Florez  
**Email:** [tu-email@ejemplo.com]  
**GitHub:** [tu-github-url]  
**LinkedIn:** [tu-linkedin-url]

---

## 📄 Licencia

Este proyecto está bajo licencia MIT. Ver `LICENSE` para más detalles.

---

**Última actualización:** 3 de junio de 2026
