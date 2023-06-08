// popupScript.js
(() => {
    const loadSettings = () => {
      return new Promise((resolve) => {
        chrome.storage.sync.get(null, (settings) => {
          resolve(settings);
        });
      });
    };
  
    const saveSettings = () => {
      const intensity = parseFloat(document.getElementById('intensity').value);
  
      const boldElements = Array.from(document.querySelectorAll('input[name="boldElements"]:checked')).map((input) => input.value);
  
      const settings = { intensity, boldElements };
      chrome.storage.sync.set(settings, () => {
        // Display a notification to inform the user that settings were saved
        chrome.notifications.create({
          type: 'basic',
          title: 'WordWise Options',
          message: 'Settings saved successfully.',
          iconUrl: 'icon.png',
        });
      });
    };
  
    loadSettings().then((settings) => {
      document.getElementById('intensity').value = settings.intensity;
  
      const boldElements = settings.boldElements || [];
      boldElements.forEach((element) => {
        const input = document.querySelector(`input[name="boldElements"][value="${element}"]`);
        if (input) {
          input.checked = true;
        }
      });
    });
  
    document.getElementById('saveButton').addEventListener('click', saveSettings);
  })();
  