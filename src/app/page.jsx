

import Banner from "./components/Banner/index";
import Cook from "./components/Cook/index";
import LoginJovas from "./components/IniciarSesion-Registrar/General/LoginJovas";
import Registrar from "./components/Registrar";
import Features from "./components/Work/index";
import Expert from "./components/Expert/index";
import Gallery from "./components/Gallery/index";
import Newsletter from "./components/Newsletter/Newsletter";
import Login from "./components/IniciarSesion-Registrar/Login";



export default function Home() {
  return (
 
  <div>
   

  
    {/* <Registrar/>  */}
    {/* <CrearReceta/> */}

    <Banner/>
    <Features/>
    <Cook/>
    <Expert/>
    <Gallery/>
    <Newsletter/>
    </div>

   
  );
}

