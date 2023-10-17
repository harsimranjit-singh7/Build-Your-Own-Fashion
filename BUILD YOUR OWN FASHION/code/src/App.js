import appcss from './assets/styles/App.module.css';
import Carousels from './components/LandingPage/Carousels';
import Footer from './components/LandingPage/Footer';
import ItemsComponent from './components/LandingPage/ItemsComponent';
import NavBar from './components/LandingPage/NavBar';

function App() {
  return (
    <div className={appcss.App}>
      <NavBar />
      <Carousels />
      <ItemsComponent />
      <Footer />
    </div>
  );
}

export default App;
