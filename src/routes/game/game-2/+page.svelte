<script>
  import { goto } from "$app/navigation";
  import { user, times } from "$lib/UserStore";

  /**
   * @type {number[]}
   */
  const numArray = [];
  /**
   * @type {number[]}
   */
  const solution = [...Array(15).keys()];
  solution.push(undefined);
  let blankIndex = 15;
  let gameWon = false;
  let tutorial = true;
  let startTime = 0;

  const start = {
    x: 0,
    y: 0,
  };
  const end = {
    x: 0,
    y: 0,
  };

  function handleTouchStart(event) {
    event.preventDefault();
    start.x = event.changedTouches[0].screenX;
    start.y = event.changedTouches[0].screenY;
  }

  function handleTouchEnd(event) {
    event.preventDefault();
    end.x = event.changedTouches[0].screenX;
    end.y = event.changedTouches[0].screenY;
    const difference = {
      x: end.x - start.x,
      y: end.y - start.y,
    };
    const minimumMovement = 100;
    const dir =
      Math.abs(difference.x) > Math.abs(difference.y)
        ? difference.x > 0
          ? -1
          : 1
        : difference.y > 0
        ? -4
        : 4;
    move(dir);
  }

  /**
   * @param {number} dir
   */
  function move(dir) {
    switch (dir) {
      case 1:
        if (blankIndex % 4 !== 3) {
          const temp = numArray[blankIndex];
          numArray[blankIndex] = numArray[blankIndex + dir];
          numArray[blankIndex + dir] = temp;
          blankIndex += dir;
        }
        break;
      case -1:
        if (blankIndex % 4 !== 0) {
          const temp = numArray[blankIndex];
          numArray[blankIndex] = numArray[blankIndex + dir];
          numArray[blankIndex + dir] = temp;
          blankIndex += dir;
        }
        break;

      case 4:
        if (Math.floor(blankIndex / 4) !== 3) {
          const temp = numArray[blankIndex];
          numArray[blankIndex] = numArray[blankIndex + dir];
          numArray[blankIndex + dir] = temp;
          blankIndex += dir;
        }
        break;

      case -4:
        if (Math.floor(blankIndex / 4) !== 0) {
          const temp = numArray[blankIndex];
          numArray[blankIndex] = numArray[blankIndex + dir];
          numArray[blankIndex + dir] = temp;
          blankIndex += dir;
        }
        break;
    }
    gameWon = checkSolution();
  }

  function handleKeydown(event) {
    const keycode = event.code;
    switch (keycode) {
      case "ArrowDown":
        move(-4);
        break;
      case "ArrowUp":
        move(4);
        break;
      case "ArrowLeft":
        move(1);
        break;
      case "ArrowRight":
        move(-1);
        break;
    }
  }
  function generateRandomArray() {
    while (numArray.length > 0) {
      numArray.pop();
    }
    const newArray = [...Array(15).keys()];
    for (let i = 0; i < 15; i++) {
      const randomNum = newArray[Math.floor(Math.random() * newArray.length)];
      newArray.splice(newArray.indexOf(randomNum), 1);
      numArray.push(randomNum);
    }
  }

  function findIfSolvable() {
    let c = 0;
    for (let i = 0; i < 15; i++) {
      for (let j = i + 1; j < 16; j++) {
        if (numArray[j] < numArray[i]) {
          c++;
        }
      }
    }
    if (c % 2 == 0) {
      return true;
    }
    return false;
  }
  function checkSolution() {
    let won = true;
    for (let i = 0; i < solution.length; i++) {
      if (numArray[i] !== solution[i]) {
        won = false;
      }
    }
    if (won) {
      setVictory();
    }
    return won;
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
    $user.level = 2;
  }

  do {
    generateRandomArray();
  } while (!findIfSolvable());

  function startGame() {
    tutorial = false;
    startTime = Date.now();
  }
</script>

<svelte:window
  on:touchstart={handleTouchStart}
  on:touchend={handleTouchEnd}
  on:keydown={handleKeydown}
/>
{#if gameWon}
  <div class="won-container">
    <h1>Game Completed!</h1>
    <button on:click={() => goto("/game/game-3")} class="submit-btn"
      >Go to Next Level</button
    >
  </div>
{:else if tutorial && $user.level === 1}
  <div class="tutorial-container">
    <h1>How to play:</h1>
    <h3>
      When the game starts, you will see a 4x4 square filled with numbers
      randomly.
    </h3>
    <h3>Your goal is to arrange all the numbers in order.</h3>
    <h3>The order is:</h3>
  </div>
  <div class="container">
    <div class="game">
      {#each Array(16) as _, index (index)}
        {#if solution[index] + 1}
          <span class="box">{solution[index] + 1}</span>
        {:else}
          <span class="box" />
        {/if}
      {/each}
    </div>
    <button on:click={startGame} class="submit-btn">Continue to game.</button>
  </div>
{:else if $user.level === 1}
  <div class="container">
    <h1>Level 2: Solve this 15 Puzzle</h1>
    <div class="game">
      {#each Array(16) as _, index (index)}
        {#if numArray[index] + 1}
          <span class="box">{numArray[index] + 1}</span>
        {:else}
          <span class="box" />
        {/if}
      {/each}
    </div>
  </div>
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

<style>
  .won-container,
  .game-error-container {
    display: flex;
    text-align: center;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 3rem;
    height: 80vh;
  }
  .tutorial-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    margin-top: 2rem;
  }
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 3rem;
    height: 80vh;
  }

  .game {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(4, 1fr);
    gap: 0.5rem;
  }

  .box {
    aspect-ratio: 1;
    width: min(20vw, 120px);
    background-color: red;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
  }
</style>
