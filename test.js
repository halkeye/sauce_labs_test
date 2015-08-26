import Selenium from './src/index';
import assert from 'assert';

const s = new Selenium();

// https://gist.github.com/danharper/74a5102363fbd85f6b67
const sleep = (ms = 0) => {
  return new Promise(r => setTimeout(r, ms));
};

const main = async function() { //eslint-disable-line
  try {
    // Open a browser (I recommend Safari if you're on Mac since the Safari driver comes with the Selenium server)
    const session = await s.createSession();
    // Navigate to http://google.com
    await session.navigate('http://www.google.com');

    // Get the title of the page
    const title = await session.title();
    // Assert that it contains "Google"
    assert(title, 'google');

    // Find the element representing the search box
    const element = await session.elementByName('q');
    // Type a string into the search box
    await element.setValue('gavin');

    const bodyElement = await session.elementById('hplogo');
    await bodyElement.click();
//    await sleep(1000);

    // Find the element representing the search button
    const button = await session.elementByName('btnK');
    // Click the search button element
    await button.click();

    const searchTextBoxElement = await session.elementByName('q');
    // Assert that the resulting page contains the text of your search string
    assert(searchTextBoxElement.text(), 'gavin');

    // Close the browser
    await session.destroy();
  } catch (err) {
    console.log(err);
    console.log(err.stack);
  }
};

main();

