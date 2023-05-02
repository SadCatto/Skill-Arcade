<script lang="ts">
  // The ordering of these imports is critical to your app working properly
  import "@skeletonlabs/skeleton/themes/theme-rocket.css";
  // If you have source.organizeImports set to true in VSCode, then it will auto change this ordering
  import "@skeletonlabs/skeleton/styles/all.css";
  // Most of your app wide CSS should be put in this file
  import "../app.postcss";
  import { AppShell, AppBar } from "@skeletonlabs/skeleton";
  import { Drawer, drawerStore } from "@skeletonlabs/skeleton";
  import Navigation from "$lib/Navigation.svelte";
  import { user, isLoggedIn, times } from "$lib/UserStore.js";
  import { deserialize } from "$app/forms";
  import { isModalOpen, error } from "$lib/UtilityStore.js";
  export let data;

  function drawerOpen(): void {
    drawerStore.open({});
  }

  /**
   * @param {import("./$types.js").PageData} userData
   */
  function setDataInStore(userData: import("./$types.js").PageData) {
    if (!userData || userData.success === false) {
      $error = "Invalid Credentials"
      return
    }
    if (!userData.userDetails) {
      return;
    }
    let details = deserialize(userData.userDetails);
    $user.name = details["username"];
    $user.email = details["email"];
    $user.level = details["level"];
    $user.isAdmin = details["isAdmin"];
    $times = details["scores"];
    $isLoggedIn = true;
    $isModalOpen = false;
  }

  $: setDataInStore(data);
</script>

<Drawer>
  <Navigation />
</Drawer>

<!-- App Shell -->
<AppShell slotSidebarLeft="bg-surface-500/5 w-0 lg:w-64">
  <svelte:fragment slot="header">
    <!-- App Bar -->
    <AppBar>
      <svelte:fragment slot="lead">
        <div class="flex items-center">
          <button class="lg:hidden btn btn-sm mr-4" on:click={drawerOpen}>
            <span>
              <svg viewBox="0 0 100 80" class="fill-token w-4 h-4">
                <rect width="100" height="20" />
                <rect y="30" width="100" height="20" />
                <rect y="60" width="100" height="20" />
              </svg>
            </span>
          </button>
          <strong class="text-xl uppercase">SkillArcade</strong>
        </div>
      </svelte:fragment>
    </AppBar>
  </svelte:fragment>

  <!-- Sidebar -->
  <svelte:fragment slot="sidebarLeft">
    <Navigation />
  </svelte:fragment>

  <!-- Page Route Content -->
  <slot />
</AppShell>
