import Selenium from './src/index';
import assert from 'assert';

const s = new Selenium();

// https://gist.github.com/danharper/74a5102363fbd85f6b67
const sleep = (ms = 0) => {
  return new Promise(r => setTimeout(r, ms));
};

const main = async function() { //eslint-disable-line
  try {
    const session = await s.createSession();
    await session.navigate('https://www.wikipedia.org/');

    assert(await session.title(), 'Wikipedia');

    const element = await session.elementByName('search');
    await element.setValue('gavin darklighter'); // Selenium (Software)

    const button = await session.elementByName('go');
    await button.click();

    const searchTextBoxElement = await session.elementById('firstHeading');
    assert(searchTextBoxElement.text(), 'Rogue Squadron');
    assert(await session.title(), 'Rogue Squadron');

    // Close the browser
    await session.destroy();
  } catch (err) {
    console.log(err);
    console.log(err.stack);
  }
};

main();

