import { BrowserRouter, Routes, Route } from "react-router-dom";

import AdminLogin from "./pages/adminlogin";
import Adminsign from "./pages/adminsign";
import AdminDashboard from "./pages/admindashboard";
import PrivateRoute from "./components/privateroutes";
import WhiteboardCanvas from "./pages/WhiteboardCanvas";
import InviteBoardRoute from "./pages/InviteBoardRoute";
function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<AdminLogin />} />
        <Route path="/adminsign" element={<Adminsign />} />
        <Route path="/admindashboard" element={
          <PrivateRoute>
            <AdminDashboard />
          </PrivateRoute>
        } />
        <Route path="/board/:boardId" element={
          <PrivateRoute>
            <InviteBoardRoute />
          </PrivateRoute>
        } />
        <Route path="/whiteboard" element={
          <PrivateRoute>
            <WhiteboardCanvas />
          </PrivateRoute>

        } />

      </Routes>
    </BrowserRouter>
  );
}

export default App;