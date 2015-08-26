import request from 'request';
import urlJoin from 'url-join';

import Errors from './errors';

/* Move to Errors Class */
const ERRORS = {
  13: Errors.UnknownError
};


class SeleniumElement {
  constructor(session, elementId) {
    this.session = session;
    this.elementId = elementId;
    this.baseUrl = '/session/' + this.session.sessionId + '/element/' + this.elementId + '/';
  }

  // get text()
  text() {
    return this.session.client.callSelenium(
      this.baseUrl + 'text',
      null,
      'GET'
    ).then(function (body) {
      return body.value;
    });

  }

  // not sure setters can return promises
  // set text(value) {
  setValue(value) {
    return this.session.client.callSelenium(
      this.baseUrl + 'value',
      { value: value.split('') }
    ).then(function (body) {
      return body.value;
    });
  }

  click() {
    return this.session.client.callSelenium(
      this.baseUrl + 'click',
      { }
    ).then(function (body) {
      return body.value;
    });
  }
}

class SeleniumSession {
  constructor(client, sessionId, values) {
    this.client = client;
    this.sessionId = sessionId;
    this.values = values;
  }

  navigate(url) {
    return this.client.callSelenium(
      '/session/' + this.sessionId + '/url',
      { url }
    );
  }

  url() {
    return this.client.callSelenium(
      '/session/' + this.sessionId + '/url',
      null,
      'GET'
    ).then(function (body) {
      return body.value;
    });
  }

  title() {
    return this.client.callSelenium(
      '/session/' + this.sessionId + '/title',
      null,
      'GET'
    ).then(function (body) {
      return body.value;
    });
  }

  elementByName(name) {
    return this.client.callSelenium(
      '/session/' + this.sessionId + '/element',
      {
        using: 'name',
        value: name
      }
    ).then((body) => {
      return new SeleniumElement(this, body.value.ELEMENT);
    });
  }
 
  elementById(name) {
    return this.client.callSelenium(
      '/session/' + this.sessionId + '/element',
      {
        using: 'id',
        value: name
      }
    ).then((body) => {
      return new SeleniumElement(this, body.value.ELEMENT);
    });
  }

  elementByTagName(name) {
    return this.client.callSelenium(
      '/session/' + this.sessionId + '/element',
      {
        using: 'tag name',
        value: name
      }
    ).then((body) => {
      // {"sessionId":"de08d446efadc177ceb8b593ef97235c","status":0,"value":{"ELEMENT":"0.86702033970505-1"}}
      return new SeleniumElement(this, body.value.ELEMENT);
    });
  }

  destroy() {
    return this.client.callSelenium(
      '/session/' + this.sessionId + '/element',
      null,
      'DELETE'
    )
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
              return reject(new ERRORS[body.status](options.url + ': ' + body.value.message));
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
