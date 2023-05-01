<script>
  import { deserialize } from "$app/forms";
  let users = [];
  export let data;
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

<div class="container">
  <h1>Leaderboard</h1>

  <!-- Responsive Container (recommended) -->
  <div class="table-container">
    <!-- Native Table Element -->
    <table class="table table-hover">
      <thead>
        <tr>
          <th>Position</th>
          <th>Name</th>
          <th>Score</th>
          <th>Total time</th>
        </tr>
      </thead>
      <tbody>
        {#each users as user, i}
          <tr>
            <td>{i + 1}</td>
            <td>{user.username}</td>
            <td>{user.finalScore}</td>
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
