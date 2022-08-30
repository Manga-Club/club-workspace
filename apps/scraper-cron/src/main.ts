import { getAllChapters } from './app/chapters';
import { verifyComics } from './app/comics';
var term = require('terminal-kit').terminal;

term.cyan('Welcome to the debug tool.\n');
term.cyan('Pick a script.\n');

var items = ['1. Verify New Comics', '2. Get All Chapters'];
const functions = [verifyComics, getAllChapters];

const runOptions = () => {
  term.singleColumnMenu(items, async (err, response) => {
    if (err) {
      term('\n').eraseLineAfter.red('#Error - %s\n', err.message);
      return;
    }

    term('\n').eraseLineAfter.green('#Selected - %s\n', response.selectedText);
    2;

    const currentFunction = functions[response.selectedIndex];

    // In the future this will be dynamic
    await currentFunction(
      'https://neoxscans.net/manga/the-world-after-the-end-novel/'
    );
    process.exit();
  });
};

runOptions();
