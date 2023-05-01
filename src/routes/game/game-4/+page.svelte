<script>
  import { goto } from "$app/navigation";
  import { user, times } from "$lib/UserStore";
  import { Autocomplete, Step, Stepper, popup } from "@skeletonlabs/skeleton";
  let gameWon = false,
    gameLost = false;
  let startTime = 0;
  const solutionHouseData = [
    ["Yellow", "Blue", "Red", "Green", "White"],
    ["Norwegian", "Dane", "Brit", "German", "Swede"],
    ["Water", "Tea", "Milk", "Coffee", "Beer"],
    ["Dunhill", "Blend", "Pall Mall", "Prince", "Blue Master"],
    ["Cat", "Horse", "Birds", "Fish", "Dog"],
  ];

  let attributes = [
    ["Yellow", "Blue", "Red", "Green", "White"],
    ["Norwegian", "Dane", "Brit", "German", "Swede"],
    ["Water", "Tea", "Milk", "Coffee", "Beer"],
    ["Dunhill", "Blend", "Pall Mall", "Prince", "Blue Master"],
    ["Cat", "Horse", "Birds", "Fish", "Dog"],
  ];
  let datas = ["Color", "Nationality", "Drink", "Smoke", "Pet"];
  const intro =
    "There are 6 houses, each with a different color, owned by a person with a different profession, who has a favorite musical instrument and a favorite type of pet.";
  let clues = [
    "The Brit lives in the red house.",
    "The Swede keeps dogs as pets.",
    "The Dane drinks tea.",
    "The green house is on the left of the white house.",
    "The green house's owner drinks coffee.",
    "The person who smokes Pall Mall rears birds.",
    "The owner of the yellow house smokes Dunhill.",
    "The man living in the center house drinks milk.",
    "The Norwegian lives in the first house.",
    "The man who smokes blends lives next to the one who keeps cats.",
    "The man who keeps horses lives next to the man who smokes Dunhill.",
    "The owner who smokes BlueMaster drinks beer.",
    "The German smokes Prince.",
    "The Norwegian lives next to the blue house.",
  ];

  /**
   * @type {any[][]}
   */
  const values = [];
  for (let i = 0; i < 5; i++) {
    const myArray = [];
    for (let j = 0; j < 5; j++) {
      myArray.push("");
    }
    values.push(myArray);
  }

  function submitHandler() {
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        if (solutionHouseData[i][j] !== values[i][j]) {
          gameLost = true;
          $user.scoreMulti *= 0.8;
          $user.level = 0;
          return;
        }
      }
    }
    gameWon = true;
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const time = Date.now() - startTime;
    let raw = JSON.stringify({
      level: $user.level,
      time: time,
      scoreMulti: $user.scoreMulti,
    });

    let requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("/game/scores", requestOptions);
    let tempTimes = $times;
    tempTimes[$user.level] = Math.floor(time / 1000);
    $times = tempTimes;
    $user.level = 4;
  }

  /**
   * @param {string[]} array
   * @returns {string[]}
   */
  function shuffle(array) {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
      // Pick a random index
      let index = Math.floor(Math.random() * counter);

      // Decrease counter by 1
      counter--;

      // And swap the last element with it
      let temp = array[counter];
      array[counter] = array[index];
      array[index] = temp;
    }
    return array;
  }
  for (let i = 0; i < 5; i++) {
    attributes[i] = shuffle(attributes[i]);
  }

  function startGame() {
    if (!startTime) {
      startTime = Date.now();
    }
  }
</script>

{#if gameWon}
  <div class="won-container">
    <h1>Game Completed!</h1>
    <button on:click={() => goto("/game/game-5")} class="submit-btn"
      >Go to Next Level</button
    >
  </div>
{:else if gameLost}
  <div class="won-container">
    <h1>Oh no, you lost the game.</h1>
  </div>
{:else if $user.level !== 3}
  <div class="game-error-container">
    <h1>Invalid game. You can only finish the games in order..</h1>
    <button
      class="submit-btn"
      on:click={() => goto("/game/game-" + ($user.level + 1))}
      >Go to current game</button
    >
  </div>
{:else}
  <div class="stepper-container">
    <Stepper stepTerm="Clue" on:complete={submitHandler} on:next={startGame}>
      <Step>
        <svelte:fragment slot="header">Tutorial</svelte:fragment>

        <h1>Einstein's problem</h1>
        <h4 class="">
          {intro}. You will be given {clues.length} clues. On the basis of these
          clues, on the basis of these clues, you have to determine all the attributes,
          i.e. Color, Profession, Musical Instrument and Pet of all the 6 people.
        </h4>
        <h4>
          The next {clues.length} slides contain the {clues.length} clues. There
          is a table below to help you analyze the data. Fill the table from the
          data provided, and submit when the table is full.
        </h4>
      </Step>
      {#each clues as clue, index}
        <Step>
          <svelte:fragment slot="header">Clue {index + 2}</svelte:fragment>
          <p style="font-size: 1.2rem">{clue}</p>
        </Step>
      {/each}
    </Stepper>
  </div>
  <!-- Responsive Container (recommended) -->
  <div class="table-container">
    <!-- Native Table Element -->
    <table class="table table-hover">
      <thead>
        <tr>
          <th />
          {#each Array(5) as _, index}
            <th>House #{index + 1}</th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each datas as data, row}
          <tr>
            <td>{data}</td>
            {#each attributes[row] as _, column}
              <td>
                <select
                  name="data-{row}-{column}"
                  id="data-{row}-{column}"
                  class="select"
                  bind:value={values[row][column]}
                >
                  {#each attributes[row] as value, ind}
                    <option {value}>{value}</option>
                  {/each}
                </select>
              </td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{/if}

<style>
  .won-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 3rem;
    height: 80vh;
  }
  .select {
    background-color: rgba(var(--color-tertiary-500));
  }
</style>
