import { Route, Routes } from "react-router-dom";
import { Auth, Dashboard } from "./pages";
import { Toaster } from "./components/ui/toaster";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Toaster />
    </AuthProvider>
  );
}

export default App;
