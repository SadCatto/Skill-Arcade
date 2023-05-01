<script>
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  import { isModalOpen } from "./UtilityStore";

  let stateOfModal = "Sign in";
</script>

<div id="modal" style="--display: {$isModalOpen ? 'block' : 'none'};">
  <div class="modal-head">
    <button
      class="log-in-head"
      style="border-bottom: {stateOfModal === 'Sign in'
        ? '3px solid #41AAF5'
        : 'none'}"
      on:click={() => (stateOfModal = "Sign in")}>Sign in</button
    >
    <button
      class="sign-up"
      style="border-bottom: {stateOfModal === 'Sign up'
        ? '3px solid #41AAF5'
        : 'none'}"
      on:click={() => (stateOfModal = "Sign up")}>Sign up</button
    >
  </div>
  <div class="modal-body">
    <div class="log-in-body">
      <form
        method="POST"
        action="/auth?/{stateOfModal === 'Sign up' ? 'register' : 'login'}"
        use:enhance
      >
        {#if stateOfModal === "Sign up"}
          <div class="username-group modal-input-group">
            <label for="username">Username</label>
            <input
              name="username"
              type="text"
              placeholder="Enter username here"
            />
          </div>
        {/if}
        <div class="email-group modal-input-group">
          <label for="email">Email</label>
          <input name="email" type="email" placeholder="Enter email here" />
        </div>
        <div class="password-group modal-input-group">
          <label for="password">Password</label>
          <input
            name="password"
            type="password"
            placeholder="Enter password here"
          />
        </div>
        <button class="submit-btn">{stateOfModal}</button>
      </form>
    </div>
  </div>
</div>

<style>
  #modal {
    display: var(--display);
    position: fixed;
    z-index: 2;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    color: black;
    width: min(80%, 40rem);
    margin-top: 2rem;
    z-index: 1000;
    background: linear-gradient(139.42deg, #f56387 0%, #41aaf5 98.64%);
    padding: 1.2rem;
    border-radius: 15px;
  }

  .modal-head,
  .modal-body {
    background: white;
  }

  .modal-head {
    padding: 20px 40px 20px 40px;
    border-radius: 15px 15px 0 0;
  }

  .modal-body {
    border-radius: 0 0 15px 15px;
    display: flex;
  }

  .modal-head {
    width: 100%;
    display: flex;
  }
  .modal-head > button {
    font-size: 1.5rem;
  }

  .log-in-head,
  .sign-up {
    min-width: 50%;
    padding-top: 4%;
    padding-bottom: 1%;
    text-align: center;
  }

  .log-in-body {
    width: 100%;
  }
  .modal-head > button {
    background-color: transparent;
    box-shadow: none;
    border: none;
  }

  button {
    font-weight: 700;
    font-size: 1.2rem;
  }

  /* General styling common to both */

  .modal-input-group {
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size: 1rem;
  }

  .modal-input-group > input {
    background-color: transparent;
    border: none;
    font-size: 1rem;
    border-bottom: 1px solid black;
    padding: 0.5rem 0.5rem 0.5rem 0;
  }

  .modal-input-group > input:focus {
    outline: none;
    border-bottom: 3px solid #2196f3;
    /* border-color: #2196f3; */
  }
  /* Sign In part */
  .log-in-body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0.5rem 1.5rem;
    min-width: 100%;
    gap: 1rem;
  }
  form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0.5rem 1.5rem;
    min-width: 100%;
    gap: 2rem;
  }
  /* Sign Up part */
</style>
