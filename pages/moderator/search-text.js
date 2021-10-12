import { useState } from 'react';
import { Input, Button } from '@chakra-ui/react';

function SearchText() {
  const [searchText, setSearchText] = useState();

  const handleSearch = async () => {
    console.log(`SearchText in search-text: ${searchText}`);

    await fetch(
      `/api/search-title?searchTerm=${encodeURIComponent(
        searchText,
      )}`,
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });
  };

  const handleSearchText = (event) => {
    let searchText = event.target.value;
    setSearchText(searchText);
  };

  return (
    <div>
      <h1>do a search</h1>
      <Input placeholder="Basic usage" onChange={handleSearchText} />
      <Button onClick={handleSearch}>Show Text</Button>
    </div>
  );
}

export default SearchText;
