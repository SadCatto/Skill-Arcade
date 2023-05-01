<script>
  import { deserialize } from "$app/forms";
  import { user } from "$lib/UserStore";
  /**
   * @type {any[] | import("@sveltejs/kit").ActionResult<Record<string, any>, Record<string, any>>}
   */
  let users = [];
  /**
   * @type {any}
   */
  export let data;
  /**
   * @param {{ success: boolean; userDetails: string; }} userData
   */
  function setDataInStore(userData) {
    if (!userData || userData.success === false) {
      return;
    }
    if (!userData.userDetails) {
      return;
    }
    users = deserialize(userData.userDetails);
  }

  $: setDataInStore(data);
</script>

<!-- {#if $user.isAdmin} -->
<div class="container">
  <h1>Leaderboard</h1>

  <!-- Responsive Container (recommended) -->
  <div class="table-container">
    <!-- Native Table Element -->
    <table class="table table-hover">
      <thead>
        <tr>
          <th>Index</th>
          <th>Name</th>
          <th>Score</th>
          <th>Levels cleared till now</th>
          <th>Total time taken</th>
        </tr>
      </thead>
      <tbody>
        {#each users as user, i}
          <tr>
            <td>{i + 1}</td>
            <td>{user.username}</td>
            <td>{user.finalScore}</td>
            <td>{user.level}</td>
            <td
              >{Math.floor(user.finalScore / 60)} Minutes, {user.finalScore %
                60} Seconds</td
            >
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<!-- {/if} -->

<style>
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 3rem;
    margin-top: 3rem;
  }
  .table-container {
    width: max(90%, 40rem);
  }
</style>
