import Handlebars from "handlebars";
import makeStudentsMarkup from "../templates/students.hbs?raw";

const refs = {
  getStudentsBtn: document.getElementById("get-students-btn"),
  addStudentForm: document.getElementById("add-student-form"),
  studentsTbody: document.querySelector("#students-table tbody"),
};

let editStudentId = null;

const BASE_URL = "http://localhost:3000/students";

// Функція для отримання всіх студентів

async function getStudents() {
  try {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const students = await res.json();
    return students;
  } catch (err) {
    console.error("Помилка при завантаженні студентів:", err);
  }
}

const template = Handlebars.compile(makeStudentsMarkup);

function renderStudents(students) {
  const unique = students.filter(
    (s, i, arr) => arr.findIndex((st) => st.id === s.id) === i,
  );
  const sorted = unique.sort((a, b) => a.id - b.id);

  const markup = template({ students: sorted });
  refs.studentsTbody.innerHTML = markup;
}

refs.getStudentsBtn.addEventListener("click", async () => {
  const students = await getStudents();
  renderStudents(students);
});

// Функція для додавання нового студента
// також для оновлення студента

async function addStudent(e) {
  e.preventDefault();

  const formData = new FormData(refs.addStudentForm);

  const studentData = {
    name: formData.get("name"),
    age: Number(formData.get("age")),
    course: formData.get("course"),
    skills: formData
      .get("skills")
      .split(",")
      .map((s) => s.trim()),
    email: formData.get("email"),
    isEnrolled: formData.get("isEnrolled") === "on",
  };

  try {
    if (editStudentId) {
      await fetch(`${BASE_URL}/${editStudentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studentData),
      });
    } else {
      await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studentData),
      });
    }

    renderStudents(await getStudents());
    refs.addStudentForm.reset();
    editStudentId = null;
    refs.addStudentForm.querySelector("button").textContent = "Додати студента";
  } catch (err) {
    console.error("Помилка:", err);
  }
}

// Функція для оновлення студента

function fillForm(student) {
  refs.addStudentForm.name.value = student.name;
  refs.addStudentForm.age.value = student.age;
  refs.addStudentForm.course.value = student.course;
  refs.addStudentForm.skills.value = student.skills.join(", ");
  refs.addStudentForm.email.value = student.email;
  refs.addStudentForm.isEnrolled.checked = student.isEnrolled;

  editStudentId = student.id;

  refs.addStudentForm.querySelector("button").textContent = "Зберегти зміни";
}

async function updateStudent(id) {
  const students = await getStudents();
  const student = students.find((s) => s.id == id);

  if (!student) return;

  fillForm(student);
}

// Функція для видалення студента

async function deleteStudent(id) {
  await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  renderStudents(await getStudents());
}

refs.studentsTbody.addEventListener("click", async (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const id = btn.dataset.id;

  if (btn.classList.contains("btn-delete")) {
    await deleteStudent(id);
  }
  if (btn.classList.contains("btn-edit")) {
    await updateStudent(id);
  }
});

refs.addStudentForm.addEventListener("submit", addStudent);
