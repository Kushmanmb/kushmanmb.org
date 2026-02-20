const https = require('https');

/**
 * Make an HTTPS request (GET or POST)
 * 
 * @param {string} url - The URL to request
 * @param {Object} options - Request options
 * @param {string} options.method - HTTP method ('GET' or 'POST')
 * @param {string} [options.postData] - POST data (for POST requests)
 * @param {Object} [options.headers] - Additional headers
 * @param {Function} [options.statusHandler] - Custom status code handler (res, data) => result
 * @returns {Promise<any>} - Parsed JSON response
 */
function makeRequest(url, options = {}) {
  const {
    method = 'GET',
    postData = null,
    headers = {},
    statusHandler = null,
  } = options;

  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    
    // Build request options
    const requestOptions = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: method,
      headers: {
        ...headers,
      },
    };

    // Add Content-Type and Content-Length for POST requests
    if (method === 'POST' && postData) {
      requestOptions.headers['Content-Type'] = requestOptions.headers['Content-Type'] || 'application/x-www-form-urlencoded';
      requestOptions.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = https.request(requestOptions, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        // Use custom status handler if provided
        if (statusHandler) {
          try {
            const result = statusHandler(res, data);
            resolve(result);
            return;
          } catch (error) {
            reject(error);
            return;
          }
        }

        // Default status handling
        try {
          const response = JSON.parse(data);
          resolve(response);
        } catch (error) {
          reject(new Error(`Failed to parse response: ${data}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(new Error(`Network error: ${error.message}`));
    });

    // Write POST data if provided
    if (method === 'POST' && postData) {
      req.write(postData);
    }

    req.end();
  });
}

module.exports = {
  makeRequest,
};
