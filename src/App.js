import { useEffect } from 'react';
import './App.css';

function App() {

  useEffect(()=>{ 
    console.log(process.env.REACT_APP_KEY);    
  }, [])
  return (
    <h2>hola desde app</h2>
  );
}

export default App;
