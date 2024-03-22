import { useSearchContext } from "./contexts/searchContext";

const Search = () => {
  const search = useSearchContext();
  console.log(search);

  return <>Search Page</>;
};

export default Search;
