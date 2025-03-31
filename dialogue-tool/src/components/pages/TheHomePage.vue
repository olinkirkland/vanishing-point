<template>
    <div class="page page--home">
        <Panel>
            <!-- <h1 class="logo">Storytree</h1> -->
            <!-- <p>A node-based dialogue tool</p> -->

            <Button primary>
                <i class="fas fa-plus-circle"></i>
                <span>New Project</span>
            </Button>
        </Panel>
        <footer></footer>
    </div>
</template>

<script setup lang="ts">
import Panel from '../Panel.vue';
import Button from '../ui/Button.vue';
</script>

<style lang="scss" scoped>
.page {
    height: 100vh;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .panel {
        width: 100%;
        max-width: 64rem;
    }

    h1.logo {
        font-size: 4rem;
    }
}
</style>
