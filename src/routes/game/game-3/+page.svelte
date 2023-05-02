<script>
  import { user, times } from "$lib/UserStore";

  import { goto } from "$app/navigation";
  const correctAnswerIndex = 8;
  let gameWon = false;
  let gameLost = false;
  let lastWarning = false;
  let tutorial = true;
  let startTime = 0;
  /**
   * @type {number}
   */
  let currSelect;
  /**
   * @param {number} index
   */
  function selectCurrent(index) {
    currSelect = index;
  }

  function submitAnswer() {
    if (currSelect === correctAnswerIndex) {
      gameWon = true;
      setVictory();
    } else if (lastWarning) {
      gameLost = true;
      $user.scoreMulti = $user.scoreMulti * 0.8;
      $user.level = 0;
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      let raw = JSON.stringify({
        scoreMulti: $user.scoreMulti,
      });

      let requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch("/game/setmulti", requestOptions);
    } else {
      lastWarning = true;
    }
  }

  function setVictory() {
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
    $user.level = 3;
  }

  function startGame() {
    tutorial = false;
    startTime = Date.now();
  }
</script>

<div class="container">
  {#if gameWon}
    <div class="won-container">
      <h1>Game Completed!</h1>
      <button on:click={() => goto("/game/game-4")} class="submit-btn"
        >Go to Next Level</button
      >
    </div>
  {:else if $user.level == 2}
    {#if gameLost}
      <div class="won-container">
        <h1>Oh no, you lost the game.</h1>
      </div>
    {:else if tutorial}
      <div class="waldo-container">
        <h1>Level 3: Finding Waldo</h1>
        <h3>
          When you click on continue, you will be shown a picture. From that
          picture, you have to identify where this person is:
        </h3>
        <img src="/waldo-face.jpeg" width="100" alt="" />
        <h3>
          Click on the square roughly containing him and select continue to
          verify it.
        </h3>
        <button class="submit-btn" on:click={startGame}>Start Game</button>
      </div>
    {:else}
      <div class="game-container">
        {#if lastWarning}
          <h1>Final Attempt! Select the correct square and press enter</h1>
        {:else}
          <h1>Select the Square with Waldo and Submit</h1>
        {/if}
        <div class="game">
          {#each Array(12) as _, index (index)}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <span
              class="box {index == currSelect ? 'highlighted' : ''}"
              on:click={() => selectCurrent(index)}
            />
          {/each}
        </div>
        <button class="submit-btn" on:click={submitAnswer}>Submit</button>
      </div>
    {/if}
  {:else}
    <div class="game-error-container">
      <h1>Invalid game. You can only finish the games in order..</h1>
      <button
        class="submit-btn"
        on:click={() => goto("/game/game-" + ($user.level + 1))}
        >Go to current game</button
      >
    </div>
  {/if}
</div>

<style>
  .waldo-container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    justify-content: center;
    align-items: center;
  }
  .won-container,
  .game-error-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 3rem;
    height: 80vh;
  }
  .game-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    text-align: center;
    gap: 3rem;
  }

  .game {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(3, 1fr);
    gap: 0.5rem;
    background-image: url("/waldo.jpg");
    background-size: contain;
    background-repeat: no-repeat;
  }

  .box {
    aspect-ratio: 1;
    width: min(20vw, 120px);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
  }
  .box:hover,
  .highlighted {
    background-color: rgba(0, 0, 0, 0.5);
  }
</style>
