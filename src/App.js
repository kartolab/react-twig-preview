import logo from './twig_logo.png';
import './App.css';
import TwigRenderer from './components/TwigRenderer';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} alt="logo" width={48} height={48} />
        <h1>Twig Preview</h1>
      </header>
      <div className="content">
        <TwigRenderer />
      </div>
    </div>
  );
}

export default App;
