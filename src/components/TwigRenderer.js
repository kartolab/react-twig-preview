import React, { useState, useEffect, useRef } from "react";
import * as Twig from "twig";
import 'bootstrap/dist/css/bootstrap.min.css';
import './TwigRenderer.css';

function TwigRenderer() {
  const initialTemplate = `<div class="p-3">
<h1 class="text-primary">Welcome {{ name }}!</h1>
<ul class="list-group">
    {% for item in items %}
<li class="list-group-item" style="color: {{ item.color }}">{{ item.text }}</li>
    {% endfor %}
</ul>
<script>
    console.log('Template rendered!');
    document.querySelector('h1').addEventListener('click', () => {
      alert('Hello from rendered JavaScript!');
    });
</script>
</div>`;

  const [showCode, setShowCode] = useState(false);
  const [twigCode, setTwigCode] = useState(initialTemplate);
  const [jsonData, setJsonData] = useState(
    JSON.stringify(
      {
        name: "User",
        items: [
          { text: "Item 1", color: "red" },
          { text: "Item 2", color: "green" },
          { text: "Item 3", color: "blue" },
        ],
      },
      null,
      2
    )
  );
  const [output, setOutput] = useState("");
  const outputRef = useRef(null);

  const createMarkup = (html) => {
    return { __html: html };
  };

  useEffect(() => {
    if (outputRef.current) {
      const scripts = outputRef.current.getElementsByTagName("script");
      Array.from(scripts).forEach((oldScript) => {
        const newScript = document.createElement("script");
        Array.from(oldScript.attributes).forEach((attr) => {
          newScript.setAttribute(attr.name, attr.value);
        });
        newScript.textContent = oldScript.textContent;
        oldScript.parentNode.replaceChild(newScript, oldScript);
      });
    }
  }, [output]);

  const handleRender = () => {
    try {
      const data = JSON.parse(jsonData);
      const template = Twig.twig({
        data: twigCode,
      });
      const rendered = template.render(data);
      setOutput(rendered);
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
  };

  return (
    <div className="py-4">
      <div className="row mb-4">
        <div className="col-md-8">
          <h3>Twig Template</h3>
          <textarea
            rows={15}
            className="form-control template-textarea"
            value={twigCode}
            onChange={(e) => setTwigCode(e.target.value)}
            placeholder="Enter Twig code here..."
            spellCheck="false"
            onKeyDown={(e) => {
              if (e.key === 'Tab') {
                e.preventDefault();
                const start = e.target.selectionStart;
                const end = e.target.selectionEnd;
                const spaces = '    ';
                const value = e.target.value;
                setTwigCode(value.substring(0, start) + spaces + value.substring(end));
                setTimeout(() => {
                  e.target.selectionStart = e.target.selectionEnd = start + spaces.length;
                }, 0);
              }
            }}
          />
        </div>
        <div className="col-md-4">
          <h3>JSON Data</h3>
          <textarea
          rows={15}
            className="form-control template-textarea"
            value={jsonData}
            onChange={(e) => setJsonData(e.target.value)}
            placeholder="Enter JSON data here..."
            spellCheck="false"
            onKeyDown={(e) => {
              if (e.key === 'Tab') {
                e.preventDefault();
                const start = e.target.selectionStart;
                const end = e.target.selectionEnd;
                const spaces = '    ';
                const value = e.target.value;
                setJsonData(value.substring(0, start) + spaces + value.substring(end));
                setTimeout(() => {
                  e.target.selectionStart = e.target.selectionEnd = start + spaces.length;
                }, 0);
              }
            }}
          />
        </div>
      </div>
      <div className="text-center mb-4">
        <button className="btn btn-primary" onClick={handleRender}>
          Generate Preview
        </button>
      </div>
      <div className="row">
        <div className="col-12">
          <h3>Output</h3>
          <div className="output-container">
            <div
              ref={outputRef}
              className="rendered-output"
              dangerouslySetInnerHTML={createMarkup(output)}
            />
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="showCodeCheckbox"
                checked={showCode}
                onChange={(e) => setShowCode(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="showCodeCheckbox">
                Show code
              </label>
            </div>
            {showCode && <pre className="code-output">{output}</pre>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TwigRenderer;