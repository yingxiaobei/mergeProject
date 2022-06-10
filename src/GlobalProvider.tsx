import GlobalContext from './globalContext';
import { _queryMenuTreeInfo } from 'api';
import { useFetch } from 'hooks';

interface IProps {
  children: React.ReactNode;
}

export default function GlobalProvider(props: IProps) {
  const { data: $menuTree = [] } = useFetch({
    request: _queryMenuTreeInfo,
    depends: [],
  });
  return (
    <GlobalContext.Provider value={{ $menuTree }}>
      {props.children}
    </GlobalContext.Provider>
  );
}
