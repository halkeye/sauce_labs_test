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
    return this.parent.callSelenium(
      '/session/' + this.sessionId + '/url',
      { url }
    );
  }

  url() {
    return this.parent.callSelenium(
      '/session/' + this.sessionId + '/url',
      null,
      'GET'
    ).then(function (body) {
      return body.value;
    });
  }

  title() {
    return this.parent.callSelenium(
      '/session/' + this.sessionId + '/title',
      null,
      'GET'
    ).then(function (body) {
      return body.value;
    });
  }
}

export default class Selenium {
  constructor(server = 'http://localhost:9515/') {
    this.server = server;
  }

  callSelenium(uri, data, method = 'POST') {
    return new Promise((resolve, reject) => {
      const options = {
        method,
        url: urlJoin(this.server, uri)
      };
      if (data) {
        options.json = data;
      }
      request(
        options,
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
          if (typeof body === 'string') {
            body = JSON.parse(body);
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
    return this.callSelenium('/session', { desiredCapabilities, requiredCapabilities })
      .then((body) => {
        return new SeleniumSession(this, body.sessionId, body.value);
      });
  }
}
