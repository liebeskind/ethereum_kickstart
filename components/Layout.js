import React from 'react';
import { Container } from 'semantic-ui-react';
import Head from 'next/head'; // Can use the Head tag to add things to the Header.  Like metatags, etc.
import Header from './Header';

export default (props) => {
  return (
    <Container>
      <Head>
        <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css"></link>
      </Head>
      <Header />
      {props.children}
      
    </Container>
  );
};
