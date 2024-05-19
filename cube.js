const axios = require('axios');

function postData() {
  const token = 'fe4f4d88e5f51b5fceec59526e45eda4765329d8cf97ce4edaa1a2c855c810e2';
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

  function makeRequests() {
    const postData = {
      clicksAmount: Math.floor(Math.random() * 14) + 2 // Random number between 2 and 15
    };

    axios.post(`https://server.questioncube.xyz/game/mined?token=${token}`,postData,config)
      .then((response) => {
        console.log('Response:', response.data);

        const energy = parseInt(response.data.energy, 10);

        // Check if energy is 20, if so, cooldown for 1 minute
        if (energy === 20) {
          console.log('Energy is 20, cooling down for 1 minute.');
          setTimeout(makeRequests, 60000); // 1 minute cooldown
        } else {
          // Otherwise, continue immediately
          setTimeout(makeRequests, 10); // Adjust the timeout as needed
        }
      })
      .catch((error) => {
        if (error.response) {
          console.error('Error response data:', error.response.data);
          console.error('Error response status:', error.response.status);
          console.error('Error response headers:', error.response.headers);
        } else if (error.request) {
          console.error('Error request data:', error.request);
        } else {
          console.error('Error message:', error.message);
        }
        console.error('Error config:', error.config);

        // Retry after error
        setTimeout(makeRequests,10); // Adjust the timeout as needed
      });
  }

  makeRequests();
}

postData();
