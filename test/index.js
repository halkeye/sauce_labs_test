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
    it('bad server url', function (done) {
      this.s.server = 'http://localhost:9515/blah/';
      const promise = this.s.createSession();
      promise.should.be.rejectedWith(Error).and.notify(done);
    });
    it('success', function (done) {
      const promise = this.s.createSession();
      promise.should.eventually.be.a('object').and.notify(done);
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
    it('navigate and get title', function (done) {
      const getTitle = function() {
        const promise = this.session.title();
        promise.should.eventually.equal("Google").and.notify(done);
        promise.catch(function(err) {
          console.log(err);
          done(err);
        });
        return promise;
      }.bind(this);
      this.session.navigate('http://www.google.com')
        .then(getTitle)
    });
  });
});

