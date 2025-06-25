import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import ProductList from "./components/ProductList";
import LoginPage from "./components/Login";

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<LoginPage />} /> */}
        <Route path="/" element={<ProductList />} />
      </Routes>
    </Router>
  );
}

export default App;
