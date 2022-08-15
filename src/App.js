import "./App.css";

// Import PrimeReact styles
import "./theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

import UserForm from "./users/UserForm";

function App() {
  return (
    <div className="App">
      <UserForm />
    </div>
  );
}

export default App;
