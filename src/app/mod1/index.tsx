import { Helmet } from 'react-helmet';
import { BrowserRouter } from 'react-router-dom';
import Routers from './Router';

export default function Mod1() {
  return (
    <>
      <Helmet>
        <title>Mod1</title>
      </Helmet>
      <BrowserRouter>
        <Routers />
      </BrowserRouter>
    </>
  );
}
