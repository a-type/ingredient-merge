import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

const App = () => {
  return (
    <main>
      <h1>ingredient-merge</h1>
      <section>
        <p>
          Merges multiple raw ingredient strings into groups of parsed
          ingredient data, based on which ingredients call for the same food and
          have compatible units.
        </p>
        <p>
          <a href="https://github.com/a-type/ingredient-merge">Github</a>
        </p>
      </section>
    </main>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
