import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthCtx } from "../context/AuthContext";
import Spinner from "../components/ui/Spinner";

export default function ProtectedRoute({ children }: { children: React.ReactElement }) {
  const { user, loading } = useAuthCtx();
  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
