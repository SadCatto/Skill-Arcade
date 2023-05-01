<script>
  import { drawerStore } from "@skeletonlabs/skeleton";
  function drawerClose() {
    drawerStore.close();
  }
</script>

<nav class="list-nav p-4">
  <ul>
    <li><a on:click={drawerClose} href="/">Homepage</a></li>
    <li><a on:click={drawerClose} href="/game">Games</a></li>
    <li><a on:click={drawerClose} href="/leaderboard">Leaderboard</a></li>
  </ul>
</nav>
