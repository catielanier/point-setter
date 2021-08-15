<template>
  <div class="subtotal-container">
    <div><span>Total Points:</span> {{ totalPoints }}</div>
    <div><span>Percentage:</span> {{ percentage }}%</div>
  </div>
</template>

<script>
export default {
  name: "SubTotal",
  props: {
    totalPoints: Number,
    percentage: Number,
  },
};
</script>

<style scoped>
.subtotal-container {
  display: grid;
  grid-template-columns: 50% 50%;
  border: 1px solid black;
  padding: 10px 15px;
  margin-bottom: 5px;
}

span {
  font-weight: bold;
}
</style>
