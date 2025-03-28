import React, { useState, useEffect, useRef } from "react";
import * as Twig from "twig";

function TwigRenderer() {
  const initialTemplate = `<div style="color: blue;">
<h1>Welcome {{ name }}!</h1>
<ul>
    {% for item in items %}
<li style="color: {{ item.color }}">{{ item.text }}</li>
    {% endfor %}
</ul>
<script>
    console.log('Template rendered!');
    document.querySelector('h1').addEventListener('click', () => {
      alert('Hello from rendered JavaScript!');
    });
</script>
</div>`;

  // Initial JSON data example with proper formatting
  const initialData = `{
  "name": "User",
  "items": [
    {"text": "First Item", "color": "red"},
    {"text": "Second Item", "color": "green"},
    {"text": "Third Item", "color": "blue"}
  ]
}`;

  const [twigCode, setTwigCode] = useState(initialTemplate);
  const [jsonData, setJsonData] = useState(initialData);
  const [output, setOutput] = useState("");
  const outputRef = useRef(null);

  useEffect(() => {
    if (output && outputRef.current) {
      // Find any script tags in the output
      const container = outputRef.current;
      const scripts = container.getElementsByTagName("script");
      // Execute each script
      Array.from(scripts).forEach((oldScript) => {
        const newScript = document.createElement("script");
        // Copy all attributes
        Array.from(oldScript.attributes).forEach((attr) => {
          newScript.setAttribute(attr.name, attr.value);
        });
        // Copy the content
        newScript.textContent = oldScript.textContent;
        // Replace the old script with the new one
        oldScript.parentNode.replaceChild(newScript, oldScript);
      });
    }
  }, [output]);

  const handleRender = () => {
    try {
      // Parse JSON data
      const data = JSON.parse(jsonData);

      // Compile and render Twig template
      const template = Twig.twig({
        data: twigCode,
      });

      const result = template.render(data);
      setOutput(result);
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
  };

  // Create a safe HTML container
  const createMarkup = (html) => {
    return { __html: html };
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.app_title}>Twig Template Renderer</h1>
      <div style={styles.topRow}>
        <div style={styles.column}>
          <h3>Twig Template</h3>
          <textarea
            style={styles.textarea}
            value={twigCode}
            onChange={(e) => setTwigCode(e.target.value)}
            placeholder="Enter Twig code here..."
          />
        </div>
        <div style={styles.column}>
          <h3>JSON Data</h3>
          <textarea
            style={styles.textarea}
            value={jsonData}
            onChange={(e) => setJsonData(e.target.value)}
            placeholder="Enter JSON data here..."
          />
        </div>
      </div>
      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={handleRender}>
          Render
        </button>
      </div>
      <div style={styles.bottomRow}>
        <h3>Output</h3>
        <div style={styles.output}>
          <div
            ref={outputRef}
            style={styles.renderedOutput}
            dangerouslySetInnerHTML={createMarkup(output)}
          />
          <pre style={styles.codeOutput}>{output}</pre>
        </div>
      </div>
    </div>
  );
}

const styles = {
  app_title: {
    textAlign: "center",
    margin: "20px 0",
  },
  container: {
    padding: "0 20px",
    width: "100%",
    boxSizing: "border-box",
    margin: "0",
  },
  topRow: {
    display: "flex",
    gap: "20px",
    marginBottom: "20px",
    width: "100%",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  column: {
    flex: 1,
    width: "50%",
  },
  textarea: {
    width: "100%",
    height: "200px",
    padding: "10px",
    fontSize: "14px",
    fontFamily: "monospace",
    border: "1px solid #ccc",
    borderRadius: "4px",
    whiteSpace: "pre",
    overflowWrap: "normal",
    overflowX: "auto",
    boxSizing: "border-box",
  },
  buttonContainer: {
    textAlign: "center",
    marginBottom: "20px",
    width: "100%",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  exampleButton: {
    padding: "5px 10px",
    fontSize: "12px",
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  bottomRow: {
    padding: "20px",
    backgroundColor: "#f8f9fa",
    borderRadius: "4px",
    width: "100%",
    boxSizing: "border-box",
  },
  output: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  codeOutput: {
    padding: "15px",
    backgroundColor: "#f5f5f5",
    border: "1px solid #ccc",
    borderRadius: "4px",
    minHeight: "50px",
    fontFamily: "monospace",
    whiteSpace: "pre-wrap",
    margin: 0,
    width: "100%",
    boxSizing: "border-box",
  },
  renderedOutput: {
    padding: "15px",
    backgroundColor: "white",
    border: "1px solid #ccc",
    borderRadius: "4px",
    minHeight: "50px",
    width: "100%",
    boxSizing: "border-box",
  },
};

export default TwigRenderer;
