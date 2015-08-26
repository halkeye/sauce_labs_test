import request from 'request';
import urlJoin from 'url-join';
import ExtendableError from 'es6-error';

const ERRORS = {
  13: class UnknownError extends ExtendableError {}
};

class SeleniumSession {
  constructor(parent, sessionId, values) {
    this.parent = parent;
    this.sessionId = sessionId;
    this.values = values;
  }
}

export default class Selenium {
  constructor(server = 'http://localhost:9515/') {
    this.server = server;
  }

  callSelenium(data) {
    return new Promise((resolve, reject) => {
      request({
          method: 'POST',
          url: urlJoin(this.server, '/session'),
          json: data
        },
        (err, httpResponse, body) => {
          if (err) { return reject(err); }
          if (httpResponse.statusCode !== 200) {
            return reject(new Error(body));
          }
          if (ERRORS[body.status]) {
            return reject(new ERRORS[body.status](body.value.message));
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
      return this.callSelenium({ desiredCapabilities, requiredCapabilities })
        .then((body) => {
          return resolve(new SeleniumSession(this, body.sessionId, body.value));
        })
        .catch(reject);
    });
  }
}
