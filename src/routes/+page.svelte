<script>
  import { isModalOpen, error } from "$lib/UtilityStore.js";
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
  export let form;
</script>

{#if form?.failure}
  <h1>Invalid Credentials</h1>
{/if}

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
    {#if $user.isAdmin}
      <h1>You are an admin user.</h1>
      <h1><a href="/admin-panel">Click here to go to the admin panel</a></h1>
    {/if}
    <button
      class="submit-btn"
      on:click={() => setTimeout(() => goto("/game"), 0)}
    >
      Continue to Games Dashboard
    </button>
  {:else}
    {#if $error != ""}
      <h1>{$error}</h1>
    {/if}
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
