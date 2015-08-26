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
      const that = this; //eslint-disable-line
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
    describe('navigate', function () {
      it('test', function () {
        return this.session.navigate('http://www.google.com');
      });
    });
    describe('navigate and get title', function () {
      it('test', function (done) {
        const getTitle = function () {
          const promise = this.session.title();
          promise.should.eventually.equal('Google').and.notify(done);
          promise.catch(function (err) {
            console.log(err);
            done(err);
          });
          return promise;
        }.bind(this);
        this.session.navigate('http://www.google.com')
          .then(getTitle);
      });
    });

    describe.only('Find the element representing the search box', function () {
      it('test', function (done) {
        const session = this.session;

        const setSearch = function (element) {
          const valueIsSet = element.setValue('gavin');
          console.log(valueIsSet);
          done();
        };

        const getElement = function () {
          const element = session.elementByName('q');
          element.should.eventually.equal('Google');
          element.then(setSearch);
          return element;
        };
        return session.navigate('http://www.google.com')
          .then(getElement);
      });
    });

    /*
    it('Type a string into the search box', function (done) {
    });
    it('Find the element representing the search button', function (done) {
    });
    it('Click the search button element', function (done) {
    });
    it('Assert that the resulting page contains the text of your search string', function (done) {
    });
    it('Close the browser', function (done) {
    });
    */
  });
});

