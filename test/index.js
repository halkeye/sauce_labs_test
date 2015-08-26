/*eslint-env node, mocha */
import Selenium from '../src/index';
// import nock
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.should();
chai.use(chaiAsPromised);

describe('Selenium', () => {
  describe('CreatedSession', function () {
    beforeEach(function () {
      this.s = new Selenium();
    });
    it('bad server url', function () {
      this.s.server = 'http://localhost:9515/blah/';
      const promise = this.s.createSession();
      return promise.should.be.rejectedWith(Error);
    });
    it('success', function () {
      const promise = this.s.createSession();
      promise.should.eventually.be.a('object');
      return promise;
    });
  });
  describe('CreatedSession', function () {
    beforeEach(function (done) {
      const that = this;
      const s = new Selenium();
      const promise = s.createSession();
      return promise
        .then(function (session) {
          that.session = session;
          done();
        })
        .catch(function (err) {
          done(err);
        });
    });
    it('navigate', function () {
      return this.session.navigate('http://www.google.com');
    });
  });
});

