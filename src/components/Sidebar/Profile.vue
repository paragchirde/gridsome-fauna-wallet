<template>
    <div>
        <div class="flex flex-col bg-blue justify-center rounded-sm py-2">
                <div class="text-white mx-auto">
                    <img :src="`https://avatars.dicebear.com/v2/bottts/${this.$store.state.user.email}.svg`" class="h-12 w-12">
                </div>
                <div class=" text-center font-mono text-white">
                    Hello, {{ this.$store.state.user.name }} 
                </div>
        </div>
        <vs-divider class="bg-blue"/>
    </div>
</template>
<script>
export default {
    name: 'Profile'
}
</script>