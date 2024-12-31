import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Roboto', 'Arial', sans-serif;
    background-color: #f5f5f5;
    color: #333;
    line-height: 1.6;
    margin: 0;
    padding: 0;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }

  h1, h2, h3 {
    font-family: 'Montserrat', 'Arial', sans-serif;
    color: #2c3e50;
    margin-bottom: 20px;
  }

  h1 {
    font-size: 2.5em;
    text-align: center;
  }

  h2 {
    font-size: 2em;
  }

  h3 {
    font-size: 1.5em;
  }
`;

export default GlobalStyle;