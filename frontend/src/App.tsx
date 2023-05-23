import { Routes, Route } from "react-router-dom";
import { ProductListPage } from "./component/Product";
import { CreateProductPage } from "./component/Product/create-product";
import { EditProductPage } from "./component/Product/edit-product";
import { DetailProductPage } from "./component/Product/detail-product";

function App() {
  return (
    <Routes>
      <Route path="/" element={<ProductListPage />} />
      <Route path="/create_product" element={<CreateProductPage />} />
      <Route path="/edit_product/:id" element={<EditProductPage />} />
      <Route path="/product/:id" element={<DetailProductPage />} />
    </Routes>
  );
}

export default App;
