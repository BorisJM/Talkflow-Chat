import axios from "axios";
import UserContextProvider from "./Context/UserContext";
import LoadingContextProvider from "./Context/LoadingContext";
import AppRoutes from "./Pages/Routes";

function App() {
  axios.defaults.withCredentials = true;
  axios.defaults.baseURL = "https://talkflow-zy0f.onrender.com";
  return (
    <LoadingContextProvider>
      <UserContextProvider>
        <AppRoutes />
      </UserContextProvider>
    </LoadingContextProvider>
  );
}

export default App;
