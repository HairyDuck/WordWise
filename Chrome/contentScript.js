// contentScript.js
(() => {
  // Default settings for the extension
  const defaultSettings = {
    intensity: 1.0,
    boldElements: ['p']
  };

  // Function to load settings from chrome storage
  const loadSettings = () => {
    return new Promise((resolve) => {
      chrome.storage.sync.get(defaultSettings, (storedSettings) => {
        // Merge default settings with stored settings
        resolve({ ...defaultSettings, ...storedSettings });
      });
    });
  };

  // Function to transform a word based on the settings
  const transformWord = (word, settings) => {
    // Calculate the length of the first third of the word
    const length = Math.ceil(word.length / 3);
    // Split the word into the first third and the remaining characters
    const firstThird = word.substring(0, length);
    const remainingChars = word.substring(length);

    // Return the word with the first third bolded
    return `<b>${firstThird}</b>${remainingChars}`;
  };

  // Function to transform text nodes
  const transformTextNodes = (nodes, settings) => {
    nodes.forEach((node) => {
      // Split the node's text into words
      const words = node.nodeValue.split(/\b/); // Split by word boundaries
      // Transform each word
      const transformedWords = words.map((word) => {
        // Only transform words that are not just whitespace
        if (word.trim().length > 0) {
          return transformWord(word, settings);
        }
        return word;
      });
      // Create a new span element with the transformed words
      const span = document.createElement('span');
      span.innerHTML = transformedWords.join('');
      // Replace the original node with the new span
      node.parentNode.insertBefore(span, node);
      node.parentNode.removeChild(node);
    });
  };

  // Function to process a node
  const processNode = (node, settings) => {
    // If the node is a text node, transform it
    if (node.nodeType === Node.TEXT_NODE) {
      transformTextNodes([node], settings);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      // If the node is an element node that should be bolded, process its child nodes
      if (settings.boldElements.includes(node.nodeName.toLowerCase())) {
        node.childNodes.forEach((childNode) => processNode(childNode, settings));
      }
    }
  };

  // Function to initialize the extension
  const initializeExtension = async () => {
    // Load the settings
    const settings = await loadSettings();
    // Get all text nodes in the document
    const textNodes = Array.from(document.querySelectorAll(':not(iframe):not(script):not(style):not(noscript):not(svg):not(path):not(g):not(tspan):not(rect):not(circle):not(line):not(polyline):not(polygon):not(a):not(pre):not(code):not(kbd):not(samp):not(var):not(sub):not(sup):not(del):not(s):not(i):not(b):not(u):not(ins):not(marquee):not(blink):not(font):not(select):not(option):not(thead):not(tbody):not(tr):not(td):not(th):not(object):not(video):not(audio):not(canvas)'));
    // Process each text node
    textNodes.forEach((node) => processNode(node, settings));
  };

  // Initialize the extension
  initializeExtension();

  // Listen for changes in the chrome

  
    chrome.storage.onChanged.addListener((changes) => {
      if (changes.boldElements) {
        initializeExtension();
      }
    });
  })();
  
