<script>
    import { createEventDispatcher } from "svelte";

    export let action;
    let email = "";
    let password = "";
    const dispatch = createEventDispatcher();
    function handleClick() {
        dispatch("continue", {
            "email": email,
            "password": password
        });
    }

    function handleRefresh() {
        window.location.reload();
    }



</script>

<div class="centered column">
    <input type="email" name="email-signup" id="email-signup" bind:value={email} placeholder="Email">
    <input type="password" name="password-signup" id="password-signup" bind:value={password} placeholder="Password">
    <button on:click={handleClick}>{action}</button>
    <button on:click={handleRefresh}>Back</button>

</div>