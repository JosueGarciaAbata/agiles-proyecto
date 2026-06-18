import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LogIn from "./components/login/LogIn";
import ProtectedRoute from "./middleware/ProtectedRoute";
import UserManager from "./generic/implementations/UserManager";
import ResponsibleManager from "./generic/implementations/ResponsibleManager";
import SupplierManager from "./generic/implementations/SupplierManager";
import LocationManager from "./generic/implementations/LocationManager";
import IncomeManager from "./generic/implementations/IncomeManager";
import AssetShow from "./components/asset/AssetShow";
import AssetCreate from "./components/asset/AssetCreate";
import AssetView from "./components/asset/AssetView";
import MaintanceCreate from "./components/maintance/create/MaintanceCreate";
import MaintanceShow from "./components/maintance/show/MaintanceShow";
import MaintanceView from "./components/maintance/view/MaintanceView";
import MaintanceEdit from "./components/maintance/edit/MaintanceEdit";
import Report from "./components/report/Report";
import AssetsByBatch from "./components/asset/lote/AssetsByBatch";
import BatchModal from "./components/asset/lote/BatchModal";

function App() {
  return (
    <>
      <ToastContainer
        autoClose={2000}
        pauseOnFocusLoss={false}
        limit={1}
        position="top-right"
      />
      <Router>
        {/* Begin routes */}
        <Routes>
          <Route path="/" element={<LogIn />} />
          {/* Dasboard */}
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            {/* Subrutas */}
            <Route path="users" element={<UserManager />} />
            <Route path="responsibles" element={<ResponsibleManager />} />
            <Route path="suppliers" element={<SupplierManager />} />
            <Route path="locations" element={<LocationManager />} />
            <Route path="incomes" element={<IncomeManager />} />
            <Route path="assets" element={<AssetShow />} />
            <Route path="assets/create" element={<AssetCreate />} />
            <Route path="assets/show/:id" element={<AssetView />} />
            <Route path="maintance" element={<MaintanceShow />} />
            <Route path="maintance/create" element={<MaintanceCreate />} />
            <Route path="maintance/view/:id" element={<MaintanceView />} />
            <Route path="maintance/edit/:id" element={<MaintanceEdit />} />
            <Route path="reports" element={<Report />} />
            <Route path="bath/modal" element={<BatchModal />} />
            <Route path="batch" element={<AssetsByBatch />} />
          </Route>
        </Routes>
        {/* End routes */}
      </Router>
    </>
  );
}

export default App;
