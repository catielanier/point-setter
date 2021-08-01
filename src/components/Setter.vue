<template>
  <div class="setter-container">
    <div class="dropdowns">
      <v-select
        class="select-styles"
        label="fullName"
        :options="teachers"
        @input="getCourses"
        placeholder="Select a teacher"
      />
      <v-select
        class="select-styles"
        label="fullName"
        :options="courses"
        placeholder="Select a course"
        v-if="courses.length !== 0"
        @input="getAssignments"
      />
    </div>
  </div>
</template>

<script>
import "vue-select/dist/vue-select.css";
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
      curriculumTypes: [],
      curriculum: null,
    };
  },
  async mounted() {
    const res = await axios.get("/api/teachers");
    res.data.data.forEach((teacher) => {
      teacher.fullName = `${teacher.lastName}, ${teacher.firstName} (${teacher.designation})`;
    });
    this.teachers = res.data.data;
  },
  methods: {
    getCourses: async function (e) {
      const { apiKey } = e;
      this.teacher = apiKey;
      try {
        const res = await axios({
          method: "GET",
          url: "/api/courses",
          params: {
            apiKey,
          },
        });
        const courses = [];
        res.data.courses.forEach((course) => {
          course.fullName = course.term
            ? `${course.name} (${course.term.name})`
            : course.name;
          courses.push(course);
        });
        this.courses = courses;
      } catch (e) {
        console.log(e);
      }
    },
    getAssignments: async function (e) {
      const { teacher: apiKey } = this.$data;
      const { id: course } = e;
      console.log(apiKey, course);
    },
    submitPoints: async function () {},
  },
};
</script>

<style>
.dropdowns {
  max-width: 640px;
  margin: 0 auto;
}
.select-styles {
  font-size: 1.2rem;
}
</style>
