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
