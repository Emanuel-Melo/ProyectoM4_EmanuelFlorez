import { AuthProvider } from "./context/AuthContext";
import Router from "./app/router";

export default function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}
