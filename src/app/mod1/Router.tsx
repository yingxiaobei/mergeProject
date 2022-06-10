import BasicLayouts from 'layouts/BasicLayouts';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Login from './pages/login/index';
import * as PageRouters from 'app/mod1/pages/router';
import { flatten, values } from 'lodash';
import { Suspense, useEffect } from 'react';
import { Loading } from 'components';
import { Auth } from 'utils';
import GlobalContext from 'globalContext';
import GlobalProvider from 'GlobalProvider';

const BasicLayoutsNew = BasicLayouts as any;

function Routers() {
  const Redirect = useNavigate() as any;
  useEffect(() => {
    if (!Auth.isAuthenticated()) {
      Redirect('/login');
    }
  }, [Auth.isAuthenticated()]);

  return (
    <>
      <GlobalProvider>
        <Suspense fallback={<Loading />}>
          <GlobalContext.Consumer>
            {({ $menuTree }) => {
              return (
                <Routes>
                  <Route path='/login' element={<Login />} />

                  <Route path={'/'} element={<BasicLayoutsNew />}>
                    {flatten(values(PageRouters)).map(
                      (x: any, index: number) => {
                        return (
                          <Route
                            path={x.path}
                            key={index}
                            element={<x.component />}
                          />
                        );
                      }
                    )}
                    {$menuTree.length > 0 && (
                      <Route path='*' element={<div>notFound</div>} />
                    )}
                  </Route>
                </Routes>
              );
            }}
          </GlobalContext.Consumer>
        </Suspense>
      </GlobalProvider>
    </>
  );
}

export default Routers;
