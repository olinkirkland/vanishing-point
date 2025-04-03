<template>
    <Card>
        <h1>{{ project.name }}</h1>
        <p>{{ project.description }}</p>
        <Button @click="onClickOpenProject">
            <span>Open</span>
        </Button>
    </Card>
</template>

<script setup lang="ts">
import Card from '@/components/Card.vue';
import Button from '@/components/ui/Button.vue';
import { PageName, router } from '@/router';

const props = defineProps({
    project: {
        type: Object,
        required: true
    }
});

function onClickOpenProject() {
    // Redirect to the project page with the project ID
    router.push({
        name: PageName.PROJECT,
        params: { id: props.project.id }
    });
}
</script>

<style scoped lang="scss"></style>
