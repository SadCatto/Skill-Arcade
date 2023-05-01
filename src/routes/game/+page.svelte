<script>
  import { goto } from "$app/navigation";
  import { user } from "$lib/UserStore";
  import { Avatar } from "@skeletonlabs/skeleton";
  import SpiderChart from "$lib/SpiderChart.svelte";
  import { deserialize } from "$app/forms";

  function getInitials() {
    let userName = $user.name;
    const names = userName.split(" ");
    let initials = "";
    for (let i in names) {
      initials += names[i][0];
    }
    return initials;
  }
  const initials = getInitials();
  export let data;
  const userData = deserialize(data.userDetails);
</script>

<div class="profile">
  <div class="head">
    <div class="avatar">
      <Avatar
        {initials}
        border="border-4 border-surface-300-600-token hover:!border-primary-500"
      />
      <h1>{$user.name}</h1>
    </div>
    <div class="levels">
      <h1>Levels completed: {$user.level}</h1>
    </div>
    {#if $user.level !== 5}
      <button
        class="submit-btn"
        on:click={() => goto("/game/game-" + ($user.level + 1))}
        >Enter the test</button
      >
    {:else}
      <h1>You have completed the puzzle!</h1>
    {/if}
  </div>
  <div class="body">
    {#if userData.scores}
      <SpiderChart userScoreData={userData.scores} />
    {/if}
  </div>
</div>

<style>
  .profile {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: left;
    gap: 1rem;
  }
  .profile > .head {
    display: flex;
    gap: 2rem;
    flex-direction: column;
  }
  .profile > .body {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: left;
    gap: 2rem;
  }
  .avatar {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  @media (max-width: 1200px) {
    .profile {
      flex-direction: column;
    }
  }
</style>
