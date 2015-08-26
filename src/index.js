import request from 'request';
import urlJoin from 'url-join';

import Errors from './errors';

/* Move to Errors Class */
const ERRORS = {
  13: Errors.UnknownError
};

class SeleniumSession {
  constructor(parent, sessionId, values) {
    this.parent = parent;
    this.sessionId = sessionId;
    this.values = values;
  }

  navigate(url) {
    return this.parent.postSelenium(
      '/session/' + this.sessionId + '/url',
      { url }
    );
  }
}

export default class Selenium {
  constructor(server = 'http://localhost:9515/') {
    this.server = server;
  }

  postSelenium(uri, data) {
    return new Promise((resolve, reject) => {
      request({
          method: 'POST',
          url: urlJoin(this.server, uri),
          json: data
        },
        (err, httpResponse, body) => {
          if (err) { return reject(err); }
          if (httpResponse.statusCode !== 200) {
            return reject(new Error(body));
          }
          if (body.status) {
            if (ERRORS[body.status]) {
              return reject(new ERRORS[body.status](body.value.message));
            }
            /* Unhandled Error */
            return reject(new Error(body.value.message));
          }
          return resolve(body);
        }
      );
    });
  }

  createSession(
    desiredCapabilities = { 'browserName': 'safari'},
    requiredCapabilities = {}
  ) {
    return new Promise((resolve, reject) => {
      this.postSelenium('/session', { desiredCapabilities, requiredCapabilities })
        .then((body) => {
          return resolve(new SeleniumSession(this, body.sessionId, body.value));
        })
        .catch(reject);
    });
  }
}
