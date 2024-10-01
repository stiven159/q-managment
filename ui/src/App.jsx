import Open from "./components/Open";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Owner from "./components/Owner";
import FirebaseLogin from "./components/FirebaseLogin";
import FirebaseSignup from "./components/FirebaseSignup";
import WelcomePage from "./components/customer/WelcomePage";
import OwnerList from "./components/customer/OwnerList";
import Calendar from "./components/Calander";
import CustomerLogin from "./components/customer/CustomerLogin.jsx";
import SingUp from "./components/SingUp.jsx";
import Createbussines from "./components/Createbussines.jsx";
import OwnerArea from './components/owner/OwnerArea.jsx'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Open />} />
        {/* <Route path="/Owner" element={<Owner />} />
        <Route path="/business-login" element={<Owner />} /> */}
        <Route path="/Createbussines" element={<Createbussines/>}/>
        <Route path="/login" element={<CustomerLogin />} />
        <Route path="/signup" element={<FirebaseSignup />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route exact path="/owners" element={<OwnerList />} />
         <Route path="/SingUp" element={<SingUp />}/>
        <Route path="/calander" element={<Calendar />} />
        <Route path="/create-business" element={<Createbussines />} />
        <Route path="/owner/:ownerId" element={<OwnerArea />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
