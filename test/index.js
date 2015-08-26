/*eslint-env node, mocha */
import Selenium from '../src/index';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.should();
chai.use(chaiAsPromised);

describe('Selenium', () => {
  it('bad server url', function (done) {
    const s = new Selenium('http://localhost:9515/blah/');
    const promise = s.createSession();
    return promise.should.be.rejectedWith(Error).and.notify(done);
  });
  it('test', function () {
    const s = new Selenium();
    const promise = s.createSession();
    promise.should.eventually.be.a('object');
    return promise;
  });
});

