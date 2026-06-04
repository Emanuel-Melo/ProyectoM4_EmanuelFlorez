type FirebaseLikeError = {
  code?: string;
  message?: string;
};

const authErrorMessages: Record<string, string> = {
  "auth/email-already-in-use": "Este correo ya esta registrado. Inicia sesion o usa otro correo.",
  "auth/invalid-credential": "Correo o contrasena incorrectos. Revisa tus datos e intenta de nuevo.",
  "auth/invalid-email": "El correo electronico no tiene un formato valido.",
  "auth/network-request-failed": "No hay conexion con Firebase. Verifica internet e intenta de nuevo.",
  "auth/popup-closed-by-user": "La ventana de Google se cerro antes de completar el acceso.",
  "auth/popup-blocked": "El navegador bloqueo el popup de Google. Permite popups y vuelve a intentarlo.",
  "auth/cancelled-popup-request": "El popup de Google fue cancelado por el navegador. Intenta de nuevo.",
  "auth/operation-not-supported-in-this-environment": "Este navegador no soporta el flujo de auth con popup. Se usara redireccion.",
  "auth/unauthorized-domain": "El dominio no esta autorizado en Firebase. Verifica la configuracion de Auth.",
  "auth/too-many-requests": "Demasiados intentos fallidos. Espera unos minutos antes de intentar otra vez.",
  "auth/user-disabled": "Esta cuenta fue deshabilitada. Contacta al administrador.",
  "auth/user-not-found": "No existe una cuenta registrada con este correo.",
  "auth/weak-password": "La contrasena debe tener al menos 6 caracteres.",
  "auth/wrong-password": "La contrasena es incorrecta.",
};

export function getFirebaseAuthErrorMessage(error: unknown, fallback: string) {
  const firebaseError = error as FirebaseLikeError;
  const code = firebaseError?.code;

  if (code && authErrorMessages[code]) {
    return authErrorMessages[code];
  }

  return fallback;
}

