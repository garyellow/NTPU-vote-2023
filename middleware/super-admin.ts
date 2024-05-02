export default defineNuxtRouteMiddleware(async (_to, _from) => {
    if (import.meta.client) {
        const isSuperAdmin = await $fetch('/api/check/superAdmin')

        if (!isSuperAdmin) {
            return await navigateTo('/404')
        }
    }
    else {
        return await navigateTo('/404')
    }
})
