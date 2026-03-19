import { useState, useRef, useEffect } from 'react';
import { ninocorrect } from './ninocorrect';

function App() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [intensity, setIntensity] = useState(1); // 0.5, 1, 2, or 5 (extreme)
    const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
    const [clickCount, setClickCount] = useState(() => {
        const saved = localStorage.getItem('ninoClickCount');
        return saved ? parseInt(saved, 10) : 0;
    });
    const textareaRef = useRef(null);
    const toggleRef = useRef(null);
    const buttonRefs = useRef({});

    const extremeUnlocked = clickCount >= 67;

    useEffect(() => {
        const button = buttonRefs.current[intensity];
        if (button && toggleRef.current) {
            const containerRect = toggleRef.current.getBoundingClientRect();
            const buttonRect = button.getBoundingClientRect();
            setIndicatorStyle({
                left: buttonRect.left - containerRect.left,
                width: buttonRect.width,
            });
        }
    }, [intensity, extremeUnlocked]);

    const handleConvert = () => {
        const newCount = clickCount + 1;
        setClickCount(newCount);
        localStorage.setItem('ninoClickCount', newCount.toString());
        setOutput(ninocorrect(input, intensity));
    };

    const handleInputChange = (e) => {
        setInput(e.target.value);
        // resize textarea automatically
        const textarea = textareaRef.current;
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    };

    // enter also triggers conversion
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleConvert();
        }
    };

    return (
        <div className="App">
            <h1>NinoCorrect</h1>
            <p>The Worst Autocorrect</p>

            <textarea
                ref={textareaRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Enter text to add realistic typos..."
                rows={3}
            />

            <div className="intensity-toggle">
                <span className="intensity-label">Intensity:</span>
                <div className="toggle-buttons" ref={toggleRef}>
                    <div
                        className="toggle-indicator"
                        style={{ left: indicatorStyle.left, width: indicatorStyle.width }}
                    />
                    <button
                        ref={el => buttonRefs.current[0.5] = el}
                        className={intensity === 0.5 ? 'active' : ''}
                        onClick={() => setIntensity(0.5)}
                    >
                        Low
                    </button>
                    <button
                        ref={el => buttonRefs.current[1] = el}
                        className={intensity === 1 ? 'active' : ''}
                        onClick={() => setIntensity(1)}
                    >
                        Normal
                    </button>
                    <button
                        ref={el => buttonRefs.current[2] = el}
                        className={intensity === 2 ? 'active' : ''}
                        onClick={() => setIntensity(2)}
                    >
                        High
                    </button>
                    {extremeUnlocked && (
                        <button
                            ref={el => buttonRefs.current[5] = el}
                            className={`extreme ${intensity === 5 ? 'active' : ''}`}
                            onClick={() => setIntensity(5)}
                        >
                            Extreme
                        </button>
                    )}
                </div>
            </div>

            <button className="convert-btn" onClick={handleConvert}>NinoCorrect It!</button>

            {output && (
                <div className="output">
                    <h3>Result:</h3>
                    <p>{output}</p>
                </div>
            )}

            <footer className="footer">
                <a href="https://github.com/DCaneByTheWay/NinoCorrect" target="_blank" rel="noopener noreferrer">
                    View on GitHub
                </a>
            </footer>
        </div>
    );
}

export default App;