import {
  Input,
  Button,
  GridItem,
  Heading,
  HStack,
  Text,
} from '@chakra-ui/react';

import { useState, useEffect } from 'react';
import OverviewJamCard from '@/components/OverviewJamCard';
import AdminHeader from '@/components/AdminHeader';
import Layout from '@/components/Layout';
import LoadingState from '@/components/LoadingState';
import router from 'next/router';
import { convertDate, timeSince } from '../../utils/date';
import EmptyState from '@/components/EmptyState';
import ResultsCard from '@/components/ResultsCard';

function Moderator() {
  const [jams, setJams] = useState();
  const [searchText, setSearchText] = useState();
  const [searchResults, setSearchResults] = useState();
  const [title, setTitle] = useState([]);
  const [searchResultsJam, setSearchResultsJam] = useState();

  useEffect(() => {
    loadJams();
  }, []);

  // Call the API for a list of Jams
  const loadJams = async () => {
    let updateTitles = [];
    await fetch('/api/jamming')
      .then((response) => response.json())
      .then((jam) => {
        setJams(jam);
        jam.map((item) => {
          setTitle((title) => [...title, item.name]);
        });
      });
  };

  const handleSearch = async () => {
    console.log(`SearchText: ${searchText}`);

    await fetch(
      `/api/search-title?searchTerm=${encodeURIComponent(
        searchText,
      )}`,
    )
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        setSearchResults(data.titles);
      });
  };

  const handleSearchText = (event) => {
    let searchText = event.target.value;
    setSearchText(searchText);
  };

  const loadSearchResults = () => {
    console.log('in load search');
    //Filter the array the Jam array so that it only shows
    // What's in the 'titles' array.

    // All the jam names array
    // Search result titles array

    // All the 'filtered' jams

    // Show component based on final array of Jam names.
    // Refactored into new component.

    let showTitles = [];

    searchResults.map((item) => {
      let addName = title.filter((name) => name === item);
      console.log(`addName: ${addName}`);
      showTitles = [...showTitles, addName];
    });

    return showTitles;
  };

  const loadFilteredJams = () => {
    console.log('Load Filtered Jams');
    let filteredJams = [];
    let jamKeys = [];

    searchResults.map((item) => {
      jams.filter((jam) => {
        if (jam.name === item) {
          // jamKeys = [...jamKeys, jam.key];
          filteredJams = [...filteredJams, jam];
        }
      });
    });

    // filteredJams.map((item) =>
    //   console.log(`item.name: ${item.name}`),
    // );

    // setSearchResultsJam(filteredJams);
    // console.log(`searchResultsJam: ${searchResultsJam}`);

    return filteredJams;
  };

  return (
    <>
      <AdminHeader />
      <HStack spacing="6">
        <Layout>
          <GridItem colSpan={{ sm: 1, md: 6 }}>
            <HStack spacing="5" mt="8" mb="2">
              <Heading as="h2" size="lg">
                Jams overview
              </Heading>
              <Button
                colorScheme="blue"
                onClick={() => router.push('/moderator/create-jam')}
              >
                Create a new Jam
              </Button>
              <Input
                placeholder="Search Term"
                onChange={handleSearchText}
                w="40%"
              />
              <Button colorScheme="blue" onClick={handleSearch}>
                Show Text
              </Button>
            </HStack>
          </GridItem>
          {!jams && (
            <GridItem colSpan={{ sm: 1, md: 6 }}>
              <LoadingState>Loading jams...</LoadingState>
            </GridItem>
          )}
          {jams && !jams.length ? (
            <GridItem colSpan={{ sm: 1, md: 6 }}>
              <EmptyState>
                No jams found. Create one using the button above!
              </EmptyState>
            </GridItem>
          ) : (
            ''
          )}

          {/* <GridItem>
            <Text>Filtered Results!</Text>
            {title && searchResults
              ? loadFilteredJams().map((item) => item.name)
              : 'no results'}
          </GridItem> */}

          {/* {jams && jams.length
            ? jams.map((jam, i) => {
                return <ResultsCard jam={jam} key={i} />;
              })
            : ''} */}

          {title && searchResults
            ? loadFilteredJams().map((item, i) => (
                <ResultsCard jam={item} key={i} />
              ))
            : jams && jams.length
            ? jams.map((jam, i) => <ResultsCard jam={jam} key={i} />)
            : ''}

          {/* {jams && jams.length
            ? jams.map((jam, i) => {
                return (
                  <>
                    <GridItem
                      key={i}
                      colSpan={{ sm: 1, md: 2 }}
                      colStart={{ sm: 1, md: 3 }}
                    >
                      <OverviewJamCard
                        jamUrl={jam.urlPath}
                        isOpen={jam.isOpen}
                        jamName={jam.name}
                        openFor={timeSince(jam.createdAt._seconds)}
                        createdAt={convertDate(
                          jam.createdAt._seconds,
                        )}
                      />
                    </GridItem>
                  </>
                );
              })
            : ''} */}
        </Layout>
      </HStack>
    </>
  );
}

Moderator.auth = true;
export default Moderator;
