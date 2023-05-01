<script>
  import { goto } from "$app/navigation";
  import { user, times } from "$lib/UserStore";

  const correctAnswerIndex = 49;
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

  function setVictory() {
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
    $user.level = 5;
  }

  function submitAnswer() {
    if (currSelect === correctAnswerIndex) {
      setVictory();
    } else if (lastWarning) {
      gameLost = true;
      $user.scoreMulti *= 0.8;
      $user.level = 0
    } else {
      lastWarning = true;
    }
  }

  function startGame() {
    tutorial = false;
    if (!startTime) {
      startTime = Date.now();
    }
  }
</script>

<div class="container">
  {#if gameWon}
    <div class="won-container">
      <h1>Game Completed!</h1>
      <button on:click={() => goto("/win-screen")} class="submit-btn"
        >You've won! Celebrate!</button
      >
    </div>
  {:else if gameLost}
    <div class="won-container">
      <h1>Oh no, you lost the game.</h1>
    </div>
  {:else if $user.level !== 4}
    <div class="game-error-container">
      <h1>Invalid game. You can only finish the games in order..</h1>
      <button
        class="submit-btn"
        on:click={() => goto("/game/game-" + ($user.level + 1))}
        >Go to current game</button
      >
    </div>
  {:else if tutorial}
    <div class="tutorial-container">
      <h1>Level 5: Murder Mystery Challenge!</h1>
      <h1>How to play:</h1>
      <h3>
        When the game starts, you will be shown 1 picture and a set of clues.
      </h3>
      <h3>
        Based on the clues, you will need to find out where the victim was
        murdered.
      </h3>
      <h3>
        Click on the square you think the victim died on and press continue to
        check it.
      </h3>
      <h3>Remember: You only get 2 chances!</h3>
      <button class="submit-btn" on:click={startGame}> Start Game </button>
    </div>
  {:else}
    <div class="game-container">
      <span class="clues">
        <h1>Here is the list of culprits and clues:</h1>
        <p>
          <strong>Austin</strong>: He was the only person sitting on a chair
        </p>
        <p><strong>Bryan</strong>: He was alone in the restroom</p>
        <p><strong>Claire</strong>: She was in the dining room with Austin</p>
        <p><strong>Dawn</strong>: She was alone in the living room</p>
        <p><strong>Edith</strong>: She was in the guest room</p>
        <p><strong>Fred</strong>: He was on the bed</p>
        <p><strong>Graham</strong>: He was in the kitchen, besides a plant</p>
        <p>
          <strong>Huxley</strong>: He was in the Master Bedroom. He was not on a
          carpet
        </p>
        <p>
          <strong>Vinny</strong>: The victim. He was in the last remaining
          position
        </p>
        <p>Everyone was in a different row and column.</p>
      </span>
      {#if lastWarning}
        <h1>Final Attempt! Select the correct square and press Submit</h1>
      {:else}
        <h1>Where was the victim located?</h1>
      {/if}
      <div class="game">
        {#each Array(81) as _, index (index)}
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
</div>

<style>
  .tutorial-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    margin-top: 2rem;
  }
  .won-container {
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
    grid-template-columns: repeat(9, 1fr);
    grid-template-rows: repeat(9, 1fr);
    background-image: url("/murder-mystery-map.png");
    background-size: contain;
    background-repeat: no-repeat;
  }

  .box {
    aspect-ratio: 1;
    width: min(10vw, 60px);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
  }
  .box:hover,
  .highlighted {
    background-color: rgba(0, 0, 0, 0.5);
  }

  .clues > p {
    text-align: left;
    font-size: 1.75rem;
    line-height: 3rem;
  }
</style>
