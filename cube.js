const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Read the tokens from token.txt
const tokenPath = path.resolve(__dirname, 'token.txt');

fs.readFile(tokenPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading token file:', err);
    return;
  }

  const tokens = data.split('\n').map(token => token.trim()).filter(token => token !== '');
  const tokenStates = new Array(tokens.length).fill(true); // State of tokens (true means active, false means cooldown)

  function postData(index) {
    if (index >= tokens.length) {
      console.log('All tokens processed.');
      return;
    }

    const token = tokens[index];
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

    const PostData = {
      clicksAmount: Math.floor(Math.random() * 14) + 2 // Random number between 2 and 15
    };

    const makeRequest = () => {
      axios.post(`https://server.questioncube.xyz/game/mined?token=${token}`, PostData, config)
        .then((response) => {
          console.log(`Token ${index + 1} Response:`, response.data);

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
          setTimeout(() => postData(index), 10); // Retry after error
        });
    };

    if (tokenStates[index]) {
      makeRequest();
    }
  }

  for (let i = 0; i < tokens.length; i++) {
    postData(i);
  }
});
