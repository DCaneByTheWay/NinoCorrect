import { useState } from 'react';
import { ninocorrect } from './ninocorrect';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const handleConvert = () => {
    setOutput(ninocorrect(input));
  };

  return (
    <div className="App">
      <h1>NinoCorrect</h1>
      <p>Enter text to add realistic typos</p>
      
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter text here..."
        rows={5}
      />
      
      <button onClick={handleConvert}>NinoCorrect It!</button>
      
      {output && (
        <div className="output">
          <h3>Result:</h3>
          <p>{output}</p>
        </div>
      )}
    </div>
  );
}

export default App;