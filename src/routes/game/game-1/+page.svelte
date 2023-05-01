<script>
  import { goto } from "$app/navigation";
  import { onDestroy } from "svelte";
  import { user, times } from "$lib/UserStore";
  import { deserialize } from "$app/forms";
  let glowing = new Array(9).fill(false);
  let level = 1;
  const glowTime = 700;
  let gameStarted = false;
  let gameFinished = false;
  let userTurn = false;
  let round = 0;

  /**
   * @type {number}
   */
  let startTime = 0;
  /**
   * @type {number[]}
   */
  const timeouts = [];
  $: gameWon = level > 3 ? true : false;

  /**
   * @param {boolean} gameWon
   */
  function setVictory(gameWon) {
    if (gameWon) {
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
      $user.level = 1;
    }
  }
  $: setVictory(gameWon);
  /**
   * @type {any[]}
   */
  let sequence = [];
  function showSequence() {
    gameStarted = true;
    if (startTime === 0) {
      startTime = Date.now();
    }
    const temp = Math.floor(Math.random() * 9);
    if (temp == sequence[level - 1]) {
      showSequence();
      return;
    }
    sequence.push(temp);
    makeGlow();
  }

  function makeGlow() {
    setTimeout(() => (userTurn = true), (level + 0.5) * glowTime);
    sequence.forEach((element, id) => {
      timeouts.push(setTimeout(glowColor, (id + 1) * glowTime, element));
    });
  }

  /**
   * @param {number} num
   */
  function glowColor(num) {
    glowing[num] = true;
    setTimeout(() => (glowing[num] = false), glowTime / 2);
  }

  /**
   * @param {number} num
   */
  function userGlow(num) {
    glowing[num] = true;
    // dispatch("playPause");
    setTimeout(() => (glowing[num] = false), glowTime / 2);
    check(num);
  }

  /**
   * @param {any} num
   */
  function check(num) {
    if (userTurn && sequence[round] == num) {
      round++;
    } else if (userTurn) {
      gameFinished = true;
      gameStarted = false;
    }

    if (round == level) {
      level++;
      round = 0;
      userTurn = false;
      showSequence();
    }
  }

  function restartGame() {
    sequence = [];
    level = 1;
    round = 0;
    gameFinished = false;
    gameStarted = true;
    userTurn = false;
    showSequence();
  }

  function clearTimeoutDestroy() {
    timeouts.forEach((ele) => {
      clearTimeout(ele);
    });
  }

  onDestroy(clearTimeoutDestroy);
</script>

<div class="container">
  {#if gameWon}
    <h1>Game Completed!</h1>
    <button class="submit-btn" on:click={() => goto("/game/game-2")}
      >Go to Next Level</button
    >
  {:else if gameStarted}
    <h1>Level: {level}</h1>
    <h1>{userTurn ? "Your" : "Wait for your"} Turn</h1>
    <span class="game">
      {#each Array(9) as _, index (index)}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <span
          class="box {userTurn ? 'bgBlue' : 'bgPink'}"
          id="box-{index}"
          class:boxGlow={glowing[index] == true}
          on:click={() => userGlow(index)}
        />
      {/each}
    </span>
  {:else if gameFinished}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div on:click={restartGame} class="container">
      <h1>Game Finished!</h1>
      <h1>Your Final Score: {level - 1}</h1>
      <h1>Click anywhere to try again</h1>
    </div>
  {:else}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div on:click={showSequence} class="container">
      <h1>Sequence Memory</h1>
      <p>
        Remember the sequence in which the blocks glow, and repeat them when
        it's your turn
      </p>
      <p>Click here to get started</p>
    </div>
  {/if}
</div>

<style>
  .container {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    height: 80vh;
    width: 100%;
    flex-direction: column;
  }

  .game {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 20px;
  }

  .box {
    width: min(20vw, 120px);
    aspect-ratio: 1;
    border-radius: min(20px, 2vw);
    margin: 20px;
    background-color: #f45d48;
    border: 2px solid black;
    transition: background-color 0.4s ease-in-out;
  }

  .bgPink {
    background-color: #f56387;
  }

  .bgBlue {
    background-color: #41aaf5;
  }

  .boxGlow {
    background-color: white;
  }
</style>
