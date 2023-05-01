<script>
  import { Radar } from "svelte-chartjs";
  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    PointElement,
    RadialLinearScale,
    LineElement,
  } from "chart.js";

  ChartJS.register(
    Title,
    Tooltip,
    Legend,
    PointElement,
    RadialLinearScale,
    LineElement
  );
  import { user } from "$lib/UserStore.js";
  /**
   * @type {number[]}
   */
  export let userScoreData = [];

  /**
   * @type {number[][]}
   */
  const userData = calculatePoints();

  const data = {
    labels: [
      "Pattern Recognition",
      "Memory",
      "Problem Solving",
      "Eye for details",
      "Data Interpretation",
      "Logical Reasoning",
    ],
    datasets: [
      {
        label: "Average Points",
        backgroundColor: "rgba(194, 116, 161, 0.5)",
        borderColor: "rgb(194, 116, 161)",
        data: [4, 4, 4, 4, 4, 4],
        fill: true,
      },
      {
        label: "Your Points",
        backgroundColor: "rgba(71, 225, 167, 0.5)",
        borderColor: "rgb(71, 225, 167)",
        data: [...userData],
        fill: true,
      },
    ],
  };

  // |0| 1 2 3 |4| 5 6 7 |8|
  //
  //  j = 1 -> 8

  function calculatePoints() {
    // Weights contains data in order of levels. 1 Array for each level
    // Inside each array of each level contains the weight of that level towards a soft skill
    // It goes in order: Pattern Recognition, Memory, Problem Solving, Eye for details, Data Interpretation, Logical Reasoning

    /**
     * @type {(string | number[])[]}
     */
    const userScoreTotal = [];
    const weights = [
      [0.5, 1, 0, 0, 0, 0],
      [0.5, 0, 1, 0, 0, 0],
      [0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0.5, 0.5],
      [0, 0, 0, 0, 0.5, 0.5],
    ];

    /**
     * @type {number[]}
     */
    let gameTimes = [];
    if (userScoreData) {
      gameTimes = userScoreData;
    }

    // Contains the times used for mapping and benchmarking.
    // Format: mininum, average, maximum
    // Anything below minimum is 8/8, Above Max is 0/8, average is 4/8 between minimum and average 4 equally distributed columns.
    const benchmarkTimes = [
      [20, 40, 60],
      [150, 240, 360],
      [60, 90, 150],
      [600, 900, 1200],
      [300, 480, 720],
    ];
    for (let i = 0; i < gameTimes.length; i++) {
      // for i in games
      if (gameTimes[i] === 0) {
        break;
      }
      const userScoresPerGame = [];
      let userPointsPerGame;
      if (gameTimes[i] < benchmarkTimes[i][0]) {
        userPointsPerGame = 9;
      } else if (gameTimes[i] > benchmarkTimes[i][2]) {
        userPointsPerGame = 1;
      } else {
        let j = 1;
        const lowerDivisions =
          (benchmarkTimes[i][1] - benchmarkTimes[i][0]) / 4;
        const upperDivisions =
          (benchmarkTimes[i][2] - benchmarkTimes[i][1]) / 4;
        while (true) {
          if (j <= 5) {
            if (gameTimes[i] < benchmarkTimes[i][0] + j * lowerDivisions) {
              userPointsPerGame = 8 - j;
              break;
            }
          } else {
            if (
              gameTimes[i] <
              benchmarkTimes[i][1] + (j - 4) * upperDivisions
            ) {
              userPointsPerGame = 8 - j;
              break;
            }
          }
          if (j >= 8) {
            break;
          }
          j++;
        }
      }

      for (let j = 0; j < weights[0].length; j++) {
        userScoresPerGame.push(weights[i][j] * userPointsPerGame);
      }
      userScoreTotal.push(userScoresPerGame);
    }
    const finalArray = Array(6).fill(0);
    for (let n = 0; n < userScoreTotal.length; n++) {
      for (let m = 0; m < finalArray.length; m++) {
        finalArray[m] += userScoreTotal[n][m];
      }
    }

    return finalArray;
  }

  /**
   * @type {{ scores: number[]; }}
   */
</script>

<div class="container">
  <Radar
    {data}
    options={{
      responsive: true,
      scales: {
        r: {
          grid: {
            color: "rgba(255, 255, 255, 0.5)",
            lineWidth: 1,
          },
          angleLines: {
            display: false,
          },
          suggestedMin: 0,
          suggestedMax: 8,
          pointLabels: {
            display: false,
          },
        },
      },
    }}
  />
</div>

<style>
  .container {
    height: min(50vh, 40rem);
    aspect-ratio: 1;
  }
</style>
