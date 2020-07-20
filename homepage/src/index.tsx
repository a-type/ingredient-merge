import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

const App = () => {
  return (
    <main>
      <h1>react-typescript-library-template</h1>
      <section>
        <p>
          This is a template repo to streamline the creation of Typescript
          libraries.
        </p>
        <p>
          Use the template repository to start your own library:{' '}
          <a href="https://github.com/a-type/typescript-library-template">
            Github
          </a>
        </p>
      </section>
    </main>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
