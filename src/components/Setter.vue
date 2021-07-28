<script>
import axios from "axios";
export default {
  name: "Setter",
  data() {
    return {
      teachers: [],
      courses: [],
      teacher: null,
      course: null,
      assignments: [],
    };
  },
  async mounted() {
    const res = await axios.get("/api/teachers");
    this.teachers = res.data.data;
  },
  methods: {
    getCourses: async function () {},
    getAssignments: async function () {},
    submitPoints: async function () {},
  },
};
</script>

<template>
  <h1>Setter</h1>
</template>
