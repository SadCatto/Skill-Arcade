<script>
  import { isModalOpen } from "$lib/UtilityStore.js";
  import { page } from "$app/stores";
  import { user, isLoggedIn } from "$lib/UserStore.js";
  import Login from "$lib/Login.svelte";
  import { goto } from "$app/navigation";
  function closeModal() {
    $isModalOpen = false;
  }

  function openModal() {
    $isModalOpen = true;
  }
</script>

<Login />
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  id="background"
  style="--position: {$isModalOpen ? 'absolute' : 'none'};
         --display: {$isModalOpen ? 'block' : 'none'}}"
  on:click={closeModal}
/>

<div class="container">
  {#if $isLoggedIn}
    <h1>Logged in as {$user.name}</h1>
    <button class="submit-btn" on:click={() => goto("/game")}
      >Continue to Games Dashboard</button
    >
  {:else}
    <h1>Welcome to Skill Arcade.</h1>
    <button class="submit-btn" on:click={openModal}>
      Register to continue
    </button>
  {/if}
</div>

<style>
  #background {
    position: var(--position);
    display: var(--display);
    z-index: 10;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(25, 25, 25, 0.8);
  }

  .container {
    display: flex;
    flex-direction: column;
    gap: 3rem;
    justify-content: center;
    align-items: center;
    height: 80vh;
  }
</style>
