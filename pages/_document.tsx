import React from 'react';
import BaseDocument, { Head, Main, NextScript, DocumentContext, DocumentInitialProps } from 'next/document';
import { ServerStyleSheets } from '@material-ui/styles';
import { theme } from '~/theme';

export default class Document extends BaseDocument {
  public static async getInitialProps(context: DocumentContext): Promise<DocumentInitialProps> {
    const sheets = new ServerStyleSheets();
    const renderPage = context.renderPage;

    context.renderPage = () => {
      return renderPage({
        enhanceApp: App => props => sheets.collect(<App {...props} />),
      });
    };

    const initialProps = await BaseDocument.getInitialProps(context);

    return {
      ...initialProps,
      styles: [sheets.getStyleElement()],
    };
  }

  public render() {
    return (
      <html>
        <Head>
          <title>Melon Network</title>
          <meta charSet="utf-8" />
          <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no" />
          <meta name="theme-color" content={theme.palette.primary.main} />
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
          <link rel="shortcut icon" href="/static/favicon.png" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
        </Head>

        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
