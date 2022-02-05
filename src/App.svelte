<script>
import { onMount } from "svelte";

	import Form from "./Form.svelte";
	let user;
	let state = "";
	let errorNotification = "";
	let syncText = "Save scores";
	

	async function getUser() {
		console.log("get user");
		chrome.runtime.sendMessage({reason: "user"}, function(response) {
    		user = response.content;
	});
	}
	onMount((async() => getUser()));
	chrome.runtime.onMessage.addListener(
		// on login, signup, logout
		function(request, sender, sendResponse) {
		if (request.reason === "useraction") {
			if (!request?.error) {
                window.location.reload();
            } else {
                errorNotification = request.error;
            }
		}
	});

	function handleRefresh() {
		window.location.reload();
	}

	function handleLoginClick() {
		state = "login";
	}

	function handleSignupClick() {
		state = "signup";
	}

	function continueLogin(event) {
		chrome.runtime.sendMessage({reason: "signin", email: event.detail.email, password: event.detail.password}, function(response) {
    		//console.log(response?.error);
  		});
	}

	function continueSignup(event) {
		chrome.runtime.sendMessage({reason: "create", email: event.detail.email, password: event.detail.password}, function(response) {
    		//console.log(response?.error);
  		});
	}

	function logout() {
		chrome.runtime.sendMessage({reason: "logout"}, function(response) {
    		//console.log(response?.error);
  		});
	}

	function handleSaveScoresClick() {
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {"reason": "needscores"}, function(response) {
				if (chrome.runtime.lastError) {
					console.warn(chrome.runtime.lastError);
          			if (chrome.runtime.lastError.message === "Could not establish connection. Receiving end does not exist.") {
          			  syncText = "This is not a Wordle game!";
          			}
          			else {
          			  syncText = "Something happened, try again?";
          			}
        		} else {
					syncText = "Syncing...";
					setTimeout(() => {
						syncText = "Sync scores";
					}, 2500);
				}
			});
        });
	}


</script>

<svelte:body on:load={getUser}></svelte:body>
<main class="centered column">
	{#if !user}
		{#if state === "signup"}
		<Form action={"Create account"} on:continue={continueSignup}/>
		<p>{errorNotification}</p>

		{:else if state === "login"}
		<Form action={"Login"} on:continue={continueLogin}/>
		<p>{errorNotification}</p>

		{:else}
		<button on:click={handleLoginClick}>Login</button>
		<button on:click={handleSignupClick}>Create account</button>
		{/if}
	{:else}
	
	<p class="logged-in-text">{user.email}</p>
	<button on:click={handleSaveScoresClick}>{syncText}</button>
	<button on:click={logout}>Log out</button>
	{/if}

</main>
<style>
	main {
		min-width: 18em;
		min-height: 25em;
	}
	
	:global(body) {
		background-color: rgb(189, 189, 189);

	}

	:global(.centered) {
		display: flex;
		
		align-items: center;
		justify-content: center;
	}

	:global(button) {
		background-color: #538d4e;
		border-radius: 3px;
		color: rgb(238, 238, 238);
		padding: 5px;
		margin: 3px;
	}

	:global(.column) {
		flex-direction: column;		
	}

	.logged-in-text {
		font-size: 15px;
		font-weight: bold;
	}
</style>