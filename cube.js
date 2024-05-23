const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Read the initData from initdata.txt
const initDataPath = path.resolve(__dirname, 'initdata.txt');

fs.readFile(initDataPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading initdata file:', err);
    return;
  }

  const initDataArray = data.split('\n').map(initData => initData.trim()).filter(initData => initData !== '');
  const tokenStates = new Array(initDataArray.length).fill(true); // State of tokens (true means active, false means cooldown)

  function postData(index) {
    if (index >= initDataArray.length) {
      console.log('All initData processed.');
      return;
    }

    const initData = initDataArray[index];
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://www.thecubes.xyz',
        'Referer': 'https://www.thecubes.xyz/',
        'Sec-Ch-Ua': '"Chromium";v="124", "Microsoft Edge";v="124", "Not-A.Brand";v="99", "Microsoft Edge WebView2";v="124"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Priority': 'u=1, i'
      }
    };
    const payload = {
      initData: initData
    };

    axios.post('https://server.questioncube.xyz/auth', payload, config)
      .then(response => {
        const token = response.data.token;
        console.log(`Received token for initData ${index + 1}:`, token);

        const postDataPayload = {
          clicksAmount: Math.floor(Math.random() * 14) + 2 // Random number between 2 and 15
        };

        const makeRequest = () => {
          axios.post(`https://server.questioncube.xyz/game/mined?token=${token}`, postDataPayload, config)
            .then((response) => {
              console.log(`Token ${index + 1}`);

              const energy = parseInt(response.data.energy, 10);

              if (energy < 20) {
                console.log(`Recharge Energy {set timer} for Token ${index + 1}`);
                tokenStates[index] = false; // Set cooldown state for the current token
                setTimeout(() => {
                  tokenStates[index] = true; // Reset the token state after cooldown
                  postData(index);
                }, 60000); // 1 minute cooldown
              } else {
                setTimeout(() => postData(index), 10); // Continue immediately for the current token
              }
            })
            .catch((error) => {
              console.error(`Error processing token ${index + 1}:`, error);
              setTimeout(() => postData(index), 10); // Retry after error
            });
        };

        if (tokenStates[index]) {
          makeRequest();
        }
      })
      .catch(error => {
        console.error(`Error getting token for initData ${index + 1}:`, error);
      });
  }

  for (let i = 0; i < initDataArray.length; i++) {
    postData(i);
  }
});
