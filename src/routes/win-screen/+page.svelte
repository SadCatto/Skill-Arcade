<script>
  import { user } from "$lib/UserStore";
</script>

<div class="game-error-container">
  {#if $user.level === 5}
    <h1>You've won!</h1>
    <img src="/celebration.gif" alt="" width="500" />
  {:else}
    <h1>Not yet buddy, not yet...</h1>
  {/if}
</div>
