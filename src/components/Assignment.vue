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
  border: 1px solid black;
  margin-bottom: 5px;
  padding: 10px 15px;
  align-items: center;
}
p {
  margin: 0;
}
input {
  width: 100%;
}
</style>
