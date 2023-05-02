import { writable } from "svelte/store";

// export const user = localStorageStore('user', {
//     name: '',
//     email: ''
// })
// export const isLoggedIn = localStorageStore('isLoggedIn', false)

export const user = writable({
    name: '',
    email: '',
    level: 0,
    scoreMulti: 1,
    isAdmin: false,
})
export let times = writable([
    0, 0, 0, 0, 0
])

export let isLoggedIn = writable(false)