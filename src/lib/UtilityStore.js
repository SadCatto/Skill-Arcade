import { writable } from 'svelte/store'

export let isModalOpen = writable(false)
export let error = writable("")
