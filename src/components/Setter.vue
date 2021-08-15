<template>
  <div class="setter-container">
    <div v-if="loading" class="loading-spinner" :aria-busy="loading" />
    <p v-if="success">Points set successfully</p>
    <p class="error" v-if="error !== ''"><span>Error:</span> {{ error }}</p>
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
          <SubTotal
            :totalPoints="classworkTotal"
            :percentage="Math.round((classworkTotal / totalPoints) * 100)"
          />
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
          <SubTotal
            :totalPoints="labsTotal"
            :percentage="Math.round((labsTotal / totalPoints) * 100)"
          />
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
          <SubTotal
            :totalPoints="discussionsTotal"
            :percentage="Math.round((discussionsTotal / totalPoints) * 100)"
          />
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
          <SubTotal
            :totalPoints="quizzesTotal"
            :percentage="Math.round((quizzesTotal / totalPoints) * 100)"
          />
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
          <SubTotal
            :totalPoints="unitExamsTotal"
            :percentage="Math.round((unitExamsTotal / totalPoints) * 100)"
          />
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
          <SubTotal
            :totalPoints="finalExamsTotal"
            :percentage="Math.round((finalExamsTotal / totalPoints) * 100)"
          />
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
        <div class="totals" v-if="totalPoints !== null">
          <h3>Total:</h3>
          <Assignment :points="totalPoints" title="Total points" />
        </div>
        <div class="button-container">
          <div>
            <button type="submit" v-if="course">Submit Points</button>
          </div>
          <div>
            <button v-if="course">Reset Points</button>
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
import SubTotal from "./SubTotal.vue";
export default {
  name: "Setter",
  components: {
    Assignment,
    SubTotal,
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
      success: false,
      error: "",
      loading: false,
      totalPoints: null,
      labsTotal: null,
      classworkTotal: null,
      discussionsTotal: null,
      unitExamsTotal: null,
      finalExamsTotal: null,
      quizzesTotal: null,
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
      this.loading = true;
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
        this.loading = false;
      } catch (e) {
        console.log(e);
        this.loading = false;
      }
    },
    getAssignments: async function (e) {
      this.loading = true;
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
          speakingPractice,
          totalPoints,
          labsTotal,
          discussionsTotal,
          quizzesTotal,
          unitExamsTotal,
          classworkTotal,
          finalExamsTotal,
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
        this.speakingPractice = speakingPractice;
        this.totalPoints = totalPoints;
        this.labsTotal = labsTotal;
        this.discussionsTotal = discussionsTotal;
        this.quizzesTotal = quizzesTotal;
        this.unitExamsTotal = unitExamsTotal;
        this.classworkTotal = classworkTotal;
        this.finalExamsTotal = finalExamsTotal;
        this.loading = false;
      } catch (e) {
        console.log(e);
        this.loading = false;
      }
    },
    submitPoints: async function () {
      this.success = false;
      this.loading = true;
      this.error = "";
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
        course,
        teacher: apiKey,
        speakingPractice,
      } = this.$data;
      const assignments = [
        ...labs,
        ...discussions,
        ...classwork,
        ...drafts,
        ...unitExams,
        ...finalExams,
        ...quizzes,
        ...lessons,
        ...preTests,
        ...speakingPractice,
      ];
      try {
        const res = await axios({
          method: "PUT",
          url: "/api/assignments",
          data: {
            apiKey,
            course,
            assignments,
          },
        });
        if (res.returnedIds.length > 0) {
          this.success = true;
        } else {
          this.error = "Assignments did not update.";
          this.loading = false;
        }
      } catch (e) {
        console.log(e);
        this.error = "Assignments did not update.";
        this.loading = false;
      }
    },
    resetPoints: async function () {
      this.error = null;
      this.loading = true;
      this.success = false;
      const {
        labs,
        discussions,
        classwork,
        unitExams,
        finalExams,
        quizzes,
        course,
        teacher: apiKey,
      } = this.$data;
      const assignments = [
        ...labs,
        ...discussions,
        ...classwork,
        ...unitExams,
        ...finalExams,
        ...quizzes,
      ];
      assignments.forEach((assignment) => {
        assignment.points_possible = 100;
      });
      try {
        const res = await axios({
          method: "PUT",
          url: "/api/assignments",
          data: {
            apiKey,
            course,
            assignments,
          },
        });
        if (res.returnedIds.length > 0) {
          this.success = true;
        } else {
          this.error = "Assignments did not update.";
          this.loading = false;
        }
      } catch (e) {
        console.log(e);
        this.error = "Assignments did not update";
        this.loading = false;
      }
    },
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
  margin: 0 auto 15px;
  text-align: left;
}
.button-container button[type="submit"] {
  width: 100%;
  background: black;
  color: wheat;
  padding: 10px 15px;
  border: 0;
}
.button-container button:not([type="submit"]) {
  width: 100%;
  border: 1px solid black;
  color: black;
  background: wheat;
  padding: 10px 15px;
}
.button-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 20px;
  margin-top: 15px;
}
.setter-container {
  position: relative;
}
@keyframes rotation {
  from {
    transform: rotateZ(0deg);
  }
  to {
    transform: rotateZ(360deg);
  }
}
.loading-spinner {
  position: fixed;
  top: 15px;
  right: 15px;
  width: 20px;
  height: 20px;
  border-radius: 20px;
  border-top: 3px solid black;
  border-right: 3px solid darkgrey;
  border-bottom: 3px solid lightgrey;
  border-left: 3px solid white;
  z-index: 5;
  background: none;
}
.loading-spinner[aria-busy="true"] {
  animation: rotation 0.5s linear infinite;
}
</style>
