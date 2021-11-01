import { useEffect, useState } from 'react';
import { Scatter, Line } from 'react-chartjs-2';
import AdminHeader from '@/components/AdminHeader';
import Layout from '@/components/Layout';
import { GridItem, HStack } from '@chakra-ui/react';

function DataPoints() {
  const [scatterData, setScatterData] = useState();
  const [statements, setStatements] = useState();

  useEffect(() => {
    loadingScatterData();
  }, []);

  const loadingScatterData = async () => {
    let coordinates = [];

    const loadScore = (agrees, disagrees) => {
      let score = (agrees - disagrees) / (agrees + disagrees);
      console.log(`score: ${score}`);
      return score;
    };

    const response = await fetch('/api/scatter');
    const data = await response.json();
    console.log(data.statement);
    setStatements(data.statement);

    data.statement.map(
      (item, index) =>
        (coordinates = [
          ...coordinates,
          {
            x: loadScore(item.numAgrees, item.numDisagrees),
            y: `${index}`,
          },
        ]),
    );

    setScatterData({
      datasets: [
        {
          label: 'Score',
          lineTension: 0.5,
          data: coordinates.map((item) => item),
          backgroundColor: 'rgb(255, 99, 132)',
          pointRadius: 8,
          pointHoverRadius: 8,
        },
      ],
    });
  };

  return (
    <>
      <AdminHeader />
      <HStack spacing="6">
        <Layout>
          <GridItem colSpan={{ sm: 1, md: 6 }}>
            <div>
              {scatterData ? (
                <Scatter
                  height="200"
                  width="400"
                  data={scatterData}
                  options={{
                    responsive: true,
                    plugins: {
                      title: {
                        display: true,
                        text: 'Scatter Graph of Statements',
                        fontSize: 20,
                      },
                      legend: {
                        display: true,
                        position: 'bottom',
                      },
                    },
                    scales: {
                      y: {
                        min: 0,
                        max: 5,
                        ticks: { stepSize: 1 },
                        title: {
                          display: true,
                          text: 'Jam: Statements',
                        },
                      },
                      x: {
                        min: -1,
                        max: 1,
                        ticks: { stepSize: 1 },
                        title: {
                          display: true,
                          text: 'Statement Score',
                        },
                      },
                    },
                  }}
                />
              ) : (
                ''
              )}
            </div>
          </GridItem>
        </Layout>
      </HStack>
    </>
  );
}

export default DataPoints;
