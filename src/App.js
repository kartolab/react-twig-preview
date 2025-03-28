import logo from './logo.svg';
import './App.css';
import TwigRenderer from './components/TwigRenderer';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Preview Twig Template</h1>
      </header>
      <div className="content">
        <TwigRenderer />
      </div>
    </div>
  );
}

export default App;
