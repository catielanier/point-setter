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
    <form @submit.prevent="submitPoints">
      <div class="points-container">
        <div class="classwork" v-if="classwork.length > 0">
          <h3>Classwork:</h3>
          <div
            class="assignment-container"
            v-for="assignment in classwork"
            :key="assignment.id"
          >
            <Assignment
              :points="assignment.points_possible"
              :title="assignment.name"
            />
          </div>
        </div>
        <div class="labs" v-if="labs.length > 0">
          <h3>Labs:</h3>
          <div
            class="assignment-container"
            v-for="assignment in labs"
            :key="assignment.id"
          >
            <Assignment
              :points="assignment.points_possible"
              :title="assignment.name"
            />
          </div>
        </div>
        <div class="discussions" v-if="discussions.length > 0">
          <h3>Discussions:</h3>
          <div
            class="assignment-container"
            v-for="assignment in discussions"
            :key="assignment.id"
          >
            <Assignment
              :points="assignment.points_possible"
              :title="assignment.name"
            />
          </div>
        </div>
        <div class="quizzes" v-if="quizzes.length > 0">
          <h3>Quizzes:</h3>
          <div
            class="assignment-container"
            v-for="assignment in quizzes"
            :key="assignment.id"
          >
            <Assignment
              :points="assignment.points_possible"
              :title="assignment.name"
            />
          </div>
        </div>
        <div class="unit-exams" v-if="unitExams.length > 0">
          <h3>Unit Exams:</h3>
          <div
            class="assignment-container"
            v-for="assignment in unitExams"
            :key="assignment.id"
          >
            <Assignment
              :points="assignment.points_possible"
              :title="assignment.name"
            />
          </div>
        </div>
        <div class="final-exams" v-if="finalExams.length > 0">
          <h3>Final Exam:</h3>
          <div
            class="assignment-container"
            v-for="assignment in finalExams"
            :key="assignment.id"
          >
            <Assignment
              :points="assignment.points_possible"
              :title="assignment.name"
            />
          </div>
        </div>
        <div class="lessons" v-if="lessons.length > 0">
          <h3>Lessons:</h3>
          <div
            class="assignment-container"
            v-for="assignment in lessons"
            :key="assignment.id"
          >
            <Assignment
              :points="assignment.points_possible"
              :title="assignment.name"
            />
          </div>
        </div>
        <div class="drafts" v-if="drafts.length > 0">
          <h3>Drafts:</h3>
          <div
            class="assignment-container"
            v-for="assignment in drafts"
            :key="assignment.id"
          >
            <Assignment
              :points="assignment.points_possible"
              :title="assignment.name"
            />
          </div>
        </div>
        <div class="pretests" v-if="preTests.length > 0">
          <h3>Pre-Tests:</h3>
          <div
            class="assignment-container"
            v-for="assignment in preTests"
            :key="assignment.id"
          >
            <Assignment
              :points="assignment.points_possible"
              :title="assignment.name"
            />
          </div>
        </div>
        <div class="speaking-practice" v-if="speakingPractice.length > 0">
          <h3>Speaking Practice:</h3>
          <div
            class="assignment-container"
            v-for="assignment in speakingPractice"
            :key="assignment.id"
          >
            <Assignment
              :points="assignment.points_possible"
              :title="assignment.name"
            />
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import "vue-select/dist/vue-select.css";
import axios from "axios";
import Assignment from "./Assignment.vue";
export default {
  name: "Setter",
  components: {
    Assignment,
  },
  data() {
    return {
      teachers: [],
      courses: [],
      teacher: null,
      course: null,
      lessons: [],
      classwork: [],
      labs: [],
      discussions: [],
      drafts: [],
      unitExams: [],
      finalExams: [],
      quizzes: [],
      preTests: [],
      speakingPractice: [],
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
      try {
        const res = await axios({
          method: "GET",
          url: "/api/assignments",
          params: {
            apiKey,
            course,
          },
        });
        const {
          labs,
          discussions,
          classwork,
          drafts,
          unitExams,
          finalExams,
          quizzes,
          lessons,
          preTests,
        } = res.data;
        this.labs = labs;
        this.discussions = discussions;
        this.classwork = classwork;
        this.drafts = drafts;
        this.unitExams = unitExams;
        this.finalExams = finalExams;
        this.quizzes = quizzes;
        this.lessons = lessons;
        this.preTests = preTests;
        this.course = course;
      } catch (e) {
        console.log(e);
      }
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
  margin-bottom: 15px;
}
.points-container {
  max-width: 1080px;
  margin: 0 auto;
  text-align: left;
}
</style>
