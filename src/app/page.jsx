

import Principal from "./components/Principal/Principal/page";
import LoginJovas from "./components/IniciarSesion-Registrar/General/LoginJovas";
import Registrar from "./components/Registrar";

import Expert from "./components/Expert/index";
import Gallery from "./components/Gallery/index";
import Newsletter from "./components/Newsletter/Newsletter";
import Login from "./components/IniciarSesion-Registrar/Login";
import Busqueda from "./recetas/Busqueda";




export default function Home() {
  return (
 
  <div>
   

  
    {/* <Registrar/>  */}
    {/* <CrearReceta/> */}
{/* <Busqueda></Busqueda> */}
    <Principal/>
   
    {/* <Features/> */}
    <Expert/>
    <Gallery/>
    <Newsletter/>
    </div>

   
  );
}

