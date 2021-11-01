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
  const [jams, setJams] = useState([]);
  const [searchText, setSearchText] = useState();
  const [searchResults, setSearchResults] = useState();
  const [title, setTitle] = useState([]);
  const [searchResultsJam, setSearchResultsJam] = useState();
  const [otherJamsResults, setOtherJamsResults] = useState([]);

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

    let showTitles = [];

    searchResults.map((item) => {
      let addName = title.filter((name) => name === item);
      console.log(`addName: ${addName}`);
      showTitles = [...showTitles, addName];
    });

    return showTitles;
  };

  // const [matchedJams, setMatchedJams] = useState();
  // const [otherJams, setOthersJams] = useState();

  // useEffect(() => {
  //   const [matchedJams, otherJams] = loadFilteredJams();
  //   setMatchedJams(matchedJams);// only running this when either jams or searchResults change
  //   setOthersJams(otherJams);
  // }, [jams, searchResults])

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

          {title && searchResults ? (
            <ShowMatchingJamsLists
              jams={jams}
              searchResults={searchResults}
              searchText={searchText}
            />
          ) : jams && jams.length ? (
            jams.map((jam, i) => <ResultsCard jam={jam} key={i} />)
          ) : (
            ''
          )}

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

function ShowMatchingJamsLists({ jams, searchResults, searchText }) {
  const loadFilteredJams = () => {
    if (!searchResults) {
      return;
    }

    const filteredJams = jams.filter((jam) =>
      searchResults.includes(jam.name),
    );

    const otherJams = jams.filter(
      (jam) => !searchResults.includes(jam.name),
    );

    return [filteredJams, otherJams];
  };

  const [matchedJams, otherJams] = loadFilteredJams(); // running this every time the component re-renders

  return (
    <>
      <h1></h1>
      <GridItem
        colSpan={{ sm: 1, md: 6 }}
        colStart={{ sm: 1, md: 3 }}
      >
        Jams matching <em>{searchText}...</em>
      </GridItem>
      {matchedJams.map((item, i) => (
        <ResultsCard jam={item} key={i} bgColour="#FFFFBF" />
      ))}
      <GridItem
        colSpan={{ sm: 1, md: 6 }}
        colStart={{ sm: 1, md: 3 }}
      >
        Other jams:
      </GridItem>
      {otherJams.map((item, i) => (
        <ResultsCard jam={item} key={i} />
      ))}
    </>
  );
}

Moderator.auth = true;
export default Moderator;
