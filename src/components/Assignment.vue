<template>
  <div class="grid-container">
    <div>
      <p>{{ title }}</p>
    </div>
    <div><input type="number" name="points" v-model="points" /></div>
  </div>
</template>

<script>
export default {
  name: "Assignment",
  props: {
    points: Number,
    title: String,
  },
};
</script>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: 80% 20%;
}
</style>
