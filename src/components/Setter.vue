<template>
  <div class="setter-container">
    <div v-if="loading" class="loading-spinner" :aria-busy="loading" />
    <p v-if="success" class="success">Points set successfully</p>
    <p class="error" v-if="error !== ''"><span>Error:</span> {{ error }}</p>
    <div class="dropdowns">
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
            <button v-if="course" @click.prevent="resetPoints">
              Reset Points
            </button>
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
import { delay } from "q";
export default {
  name: "Setter",
  components: {
    Assignment,
    SubTotal,
  },
  data() {
    return {
      courses: [],
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
    this.success = false;
    this.loading = true;
    this.error = "";
    try {
      const res = await axios({
        method: "GET",
        url: "/api/courses",
      });
      const courses = [];
      res.data.data.forEach((course) => {
        course.fullName = course.term
          ? `${course.name} (${course.term.name} - ${course.id}) `
          : `${course.name} (${course.id})`;
        courses.push(course);
      });
      this.courses = courses;
      this.loading = false;
    } catch (e) {
      console.log(e);
      this.loading = false;
      this.error = "Unable to get courses";
    }
  },
  methods: {
    getAssignments: async function(e) {
      this.success = false;
      this.loading = true;
      this.error = "";
      const { id: course } = e;
      try {
        const res = await axios({
          method: "GET",
          url: "/api/assignments",
          params: {
            course,
          },
        });
        const { assignments: filteredAssignments } = res.data;
        const unitExams = [],
          quizzes = [],
          finalExams = [],
          labs = [],
          drafts = [],
          lessons = [],
          speakingPractice = [],
          preTests = [];
        let labWeight,
          quizWeight = 0.1,
          finalExamWeight = 0.15,
          unitExamWeight,
          classworkWeight,
          discussions = [],
          classwork = [],
          totalPoints = 1000;
        filteredAssignments.forEach((assignment) => {
          const lessonIndex = assignment.name.toLowerCase().indexOf("lesson");
          const activityIndex = assignment.name
            .toLowerCase()
            .indexOf(" activity");
          const discussionIndex = assignment.name
            .toLowerCase()
            .indexOf("discussion");
          const projectIndex = assignment.name.toLowerCase().indexOf("project");
          const isLessonWithActivity =
            lessonIndex !== -1 &&
            activityIndex !== -1 &&
            lessonIndex < activityIndex;
          const isLessonWithoutActivity =
            lessonIndex !== -1 &&
            activityIndex === -1 &&
            discussionIndex === -1;
          const isProjectWithActivity =
            activityIndex !== -1 && projectIndex !== -1;
          console.log({
            name: assignment.name,
            isLessonWithActivity,
            isLessonWithoutActivity,
            isProjectWithActivity,
          });
          if (
            (isLessonWithActivity || isLessonWithoutActivity) &&
            !isProjectWithActivity
          ) {
            lessons.push(assignment);
          } else {
            if (
              assignment.name.toLowerCase().indexOf("rough draft") !== -1 ||
              assignment.name.toLowerCase().indexOf("1st draft") !== -1
            ) {
              drafts.push(assignment);
            } else {
              if (
                (assignment.name.toLowerCase().indexOf("lab") !== -1 &&
                  assignment.name.toLowerCase().indexOf("labor") === -1) ||
                (assignment.name.toLowerCase().indexOf("project") !== -1 &&
                  assignment.name.toLowerCase().indexOf("writing") === -1 &&
                  !isProjectWithActivity) ||
                assignment.name.toLowerCase().indexOf("essay") !== -1 ||
                assignment.name.toLowerCase().indexOf("research paper") !== -1
              ) {
                labs.push(assignment);
              }
              if (
                (assignment.name.toLowerCase().indexOf("writing assignment") !==
                  -1 ||
                  (assignment.name.toLowerCase().indexOf("writing") !== -1 &&
                    assignment.name.toLowerCase().indexOf("research paper") ===
                      -1 &&
                    assignment.name.toLowerCase().indexOf("essay") === -1) ||
                  assignment.name.toLowerCase().indexOf("assignment") !== -1 ||
                  assignment.name.toLowerCase().indexOf("activity") !== -1 ||
                  isProjectWithActivity) &&
                assignment.name.toLowerCase().indexOf("final exam") === -1 &&
                assignment.name.toLowerCase().indexOf("discussion") === -1
              ) {
                classwork.push(assignment);
              }
              if (
                assignment.name.toLowerCase().indexOf("discussion") !== -1 ||
                assignment.name.toLowerCase().indexOf("discuss") !== -1 ||
                assignment.name.toLowerCase().indexOf("art talk") !== -1 ||
                assignment.name.toLowerCase().indexOf("art forum") !== -1
              ) {
                discussions.push(assignment);
              }
              if (assignment.name.toLowerCase().indexOf("quiz") !== -1) {
                quizzes.push(assignment);
              }
              if (
                assignment.name.toLowerCase().indexOf("midterm") !== -1 ||
                assignment.name.toLowerCase().indexOf("test") !== -1
              ) {
                unitExams.push(assignment);
              }
              if (
                assignment.name.toLowerCase().indexOf("exam") !== -1 &&
                assignment.name.toLowerCase().indexOf("unit") !== -1 &&
                assignment.name.toLowerCase().indexOf("review") === -1
              ) {
                unitExams.push(assignment);
              }
              if (assignment.name.toLowerCase().indexOf("final exam") !== -1) {
                finalExams.push(assignment);
              }
              if (
                assignment.name.toLowerCase().indexOf("pre-test") !== -1 ||
                assignment.name.toLowerCase().indexOf("pretest") !== -1
              ) {
                preTests.push(assignment);
              }
              if (
                assignment.name.toLowerCase().indexOf("speaking practice") !==
                -1
              ) {
                speakingPractice.push(assignment);
              }
            }
          }
        });
        if (discussions.length && discussions.length >= 30) {
          classwork = [...classwork, ...discussions];
          discussions = [];
        }
        if (labs.length !== 0) {
          labWeight = classwork.length ? 0.25 : 0.45;
          classworkWeight = classwork.length ? 0.2 : null;
          unitExamWeight = 0.25;
        } else {
          classworkWeight = 0.35;
          unitExamWeight = 0.35;
        }
        if (finalExams.length === 0) {
          classworkWeight += finalExamWeight;
          finalExamWeight = 0;
        }
        if (unitExams.length === 0) {
          quizWeight += unitExamWeight;
          unitExamWeight = 0;
        }
        if (discussions.length > 0) {
          discussions.forEach((discussion) => {
            discussion.points_possible = 20;
          });
          const totalDiscussionPoints = discussions.length * 20;
          totalPoints = totalDiscussionPoints * 20;
        } else {
          totalPoints = 1000;
          classworkWeight += 0.05;
        }
        const quizPoints = Math.round(
            (totalPoints * quizWeight) / quizzes.length
          ),
          finalExamPoints = Math.round(
            (totalPoints * finalExamWeight) / finalExams.length
          ),
          unitExamPoints = Math.round(
            (totalPoints * unitExamWeight) / unitExams.length
          ),
          classworkPoints = Math.round(
            (totalPoints * classworkWeight) / classwork.length
          ),
          labPoints = labWeight
            ? Math.round((totalPoints * labWeight) / labs.length)
            : null;
        quizzes.forEach((quiz) => {
          quiz.points_possible = quizPoints;
        });
        classwork.forEach((writingAssignment) => {
          writingAssignment.points_possible = classworkPoints;
        });
        finalExams.forEach((exam) => {
          exam.points_possible = finalExamPoints;
        });
        unitExams.forEach((exam) => {
          exam.points_possible = unitExamPoints;
        });
        drafts.forEach((draft) => {
          draft.points_possible = 0;
        });
        preTests.forEach((preTest) => {
          preTest.points_possible = 0;
        });
        if (labWeight) {
          labs.forEach((lab) => {
            lab.points_possible = labPoints;
          });
        }
        lessons.forEach((lesson) => {
          lesson.points_possible = 0;
        });
        speakingPractice.forEach((practice) => {
          practice.points_possible = 0;
        });
        const labsTotal = labs.length
            ? labs[0].points_possible * labs.length
            : 0,
          classworkTotal = classwork.length
            ? classwork[0].points_possible * classwork.length
            : 0,
          discussionsTotal = discussions.length ? 20 * discussions.length : 0,
          quizzesTotal = quizzes.length
            ? quizzes[0].points_possible * quizzes.length
            : 0,
          unitExamsTotal = unitExams.length
            ? unitExams[0].points_possible * unitExams.length
            : 0,
          finalExamsTotal = finalExams.length
            ? finalExams[0].points_possible * finalExams.length
            : 0;
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
        this.error = "Unable to get assignments";
      }
    },
    submitPoints: async function() {
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
        const returnedIds = [];
        for (let i = 0; i < assignments.length; i++) {
          const res = await axios({
            method: "PUT",
            url: "/api/assignments",
            data: {
              course,
              assignmentId: assignments[i].id,
              points: assignments[i].points_possible,
            },
          });
          returnedIds.push(res.data.returnedId);
          await delay(300);
        }
        if (returnedIds.length === assignments.length) {
          this.success = true;
          this.loading = false;
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
    resetPoints: async function() {
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
      } = this.$data;
      const assignments = [
        ...labs,
        ...discussions,
        ...classwork,
        ...unitExams,
        ...finalExams,
        ...quizzes,
      ];
      try {
        const returnedIds = [];
        for (let i = 0; i < assignments.length; i++) {
          assignments[i].points_possible = 100;
          const res = await axios({
            method: "PUT",
            url: "/api/assignments",
            data: {
              course,
              assignment: assignments[i],
            },
          });
          returnedIds.push(res.data.returnedId);
          await delay(100);
        }
        if (returnedIds.length === assignments.length) {
          this.success = true;
          this.loading = false;
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
.error span {
  color: red;
  font-weight: bold;
}
.success {
  font-weight: bold;
  color: green;
}
</style>
