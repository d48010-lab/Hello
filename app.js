const timetableItems = [
  { subject: 'Data Structures', time: '09:00 - 10:00', room: 'C-204' },
  { subject: 'Database Systems', time: '10:30 - 11:30', room: 'Lab-2' },
  { subject: 'Software Engineering', time: '12:00 - 13:00', room: 'B-101' },
];

const STORAGE_KEYS = {
  assignments: 'college_companion_assignments_v1',
  history: 'college_companion_study_history_v1',
};

const timetableList = document.getElementById('timetable');
const assignmentList = document.getElementById('assignmentList');
const historyList = document.getElementById('historyList');
const assignmentCount = document.getElementById('assignmentCount');
const assignmentForm = document.getElementById('assignmentForm');
const titleInput = document.getElementById('titleInput');
const dueDateInput = document.getElementById('dueDateInput');

const aiForm = document.getElementById('aiForm');
const subjectInput = document.getElementById('subjectInput');
const topicInput = document.getElementById('topicInput');
const goalInput = document.getElementById('goalInput');
const startDateInput = document.getElementById('startDateInput');
const timeInput = document.getElementById('timeInput');
const aiOutput = document.getElementById('aiOutput');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');

function loadAssignments() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.assignments);
    if (!raw) {
      return [
        { id: crypto.randomUUID(), title: 'Computer Networks Quiz', dueDate: '2026-04-12', done: false },
        { id: crypto.randomUUID(), title: 'OS Notes Submission', dueDate: '2026-04-15', done: false },
      ];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed;
  } catch {
    return [];
  }
}

function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.history);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

let assignments = loadAssignments();
let studyHistory = loadHistory();

function saveAssignments() {
  localStorage.setItem(STORAGE_KEYS.assignments, JSON.stringify(assignments));
}

function saveHistory() {
  localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(studyHistory));
}

function renderTimetable() {
  timetableList.innerHTML = '';

  timetableItems.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'item';
    li.innerHTML = `<div><strong>${item.subject}</strong><br /><small>${item.time} · Room ${item.room}</small></div>`;
    timetableList.appendChild(li);
  });
}

function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function updateCount() {
  const pendingCount = assignments.filter((item) => !item.done).length;
  assignmentCount.textContent = `${pendingCount} pending`;
}

function renderAssignments() {
  assignmentList.innerHTML = '';

  if (assignments.length === 0) {
    const emptyState = document.createElement('li');
    emptyState.className = 'empty';
    emptyState.textContent = 'No assignments yet. Add one above.';
    assignmentList.appendChild(emptyState);
    updateCount();
    return;
  }

  assignments
    .slice()
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .forEach((assignment) => {
      const li = document.createElement('li');
      li.className = `item ${assignment.done ? 'item-done' : ''}`;
      li.innerHTML = `
        <div>
          <strong>${assignment.title}</strong><br />
          <small>Due: ${formatDate(assignment.dueDate)}</small>
        </div>
      `;

      const controls = document.createElement('div');
      controls.className = 'row-actions';

      const doneButton = document.createElement('button');
      doneButton.className = 'secondary-btn';
      doneButton.type = 'button';
      doneButton.textContent = assignment.done ? 'Undo' : 'Done';
      doneButton.addEventListener('click', () => {
        assignments = assignments.map((item) => {
          if (item.id !== assignment.id) {
            return item;
          }

          return { ...item, done: !item.done };
        });

        saveAssignments();
        renderAssignments();
      });

      const removeButton = document.createElement('button');
      removeButton.className = 'delete-btn';
      removeButton.type = 'button';
      removeButton.textContent = 'Remove';
      removeButton.addEventListener('click', () => {
        assignments = assignments.filter((item) => item.id !== assignment.id);
        saveAssignments();
        renderAssignments();
      });

      controls.append(doneButton, removeButton);
      li.appendChild(controls);
      assignmentList.appendChild(li);
    });

  updateCount();
}

function renderHistory() {
  historyList.innerHTML = '';

  if (studyHistory.length === 0) {
    const emptyState = document.createElement('li');
    emptyState.className = 'empty';
    emptyState.textContent = 'No study plans generated yet.';
    historyList.appendChild(emptyState);
    return;
  }

  studyHistory
    .slice()
    .reverse()
    .forEach((entry) => {
      const li = document.createElement('li');
      li.className = 'item';
      li.innerHTML = `
        <div>
          <strong>${entry.subject} - ${entry.topic}</strong><br />
          <small>${entry.goalLabel} · ${entry.minutes} min/day · Start ${formatDate(entry.startDate)}</small>
        </div>
      `;
      historyList.appendChild(li);
    });
}

function getGoalLabel(goalType) {
  if (goalType === 'exam') return 'Exam Prep';
  if (goalType === 'assignment') return 'Assignment Work';
  return 'Lecture Revision';
}

function getSubjectHelper(subject, topic) {
  const normalized = subject.trim().toLowerCase();
  const helpers = {
    chemistry: `Chemistry helper: focus on reaction mechanisms, periodic trends, and solving at least 3 numericals on ${topic}.`,
    botany: `Botany helper: sketch labeled diagrams, memorize plant terms, and revise taxonomy linked to ${topic}.`,
    zoology: `Zoology helper: map body systems, compare species features, and practice short definitions from ${topic}.`,
    mathematics: `Mathematics helper: solve problems step-by-step, check formulas, and redo 2 incorrect sums from ${topic}.`,
    physics: `Physics helper: list core laws, derive key equations, and solve conceptual + numerical questions on ${topic}.`,
    english: `English helper: practice one reading passage, 2 writing points, and vocabulary revision related to ${topic}.`,
    biology: `Biology helper: use active recall with labeled diagrams, cycles/process flowcharts, and key terminology from ${topic}.`,
  };

  return helpers[normalized] || `General helper: break ${topic} into concepts, examples, and quick revision questions.`;
}

function assignmentPriorityHint() {
  const pending = assignments.filter((item) => !item.done);
  if (pending.length === 0) {
    return 'No pending assignment pressure right now. Use 10 minutes to organize next week topics.';
  }

  const sorted = pending.slice().sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const next = sorted[0];
  return `Nearest deadline: ${next.title} (${formatDate(next.dueDate)}).`;
}

function addDays(isoDate, daysToAdd) {
  const date = new Date(`${isoDate}T00:00:00`);
  date.setDate(date.getDate() + daysToAdd);
  return date.toISOString().slice(0, 10);
}

function buildStepByStepTasks(goalType, minutes) {
  const warmup = Math.max(10, Math.round(minutes * 0.2));
  const deepWork = Math.max(20, Math.round(minutes * 0.5));
  const recall = Math.max(10, minutes - warmup - deepWork);

  const dayOne = [
    `Warm-up (${warmup} min): Review class notes and highlight 3 key definitions.`,
    `Core study (${deepWork} min): Solve examples and write a concise summary.`,
    `Active recall (${recall} min): Attempt 5 questions without notes.`,
  ];

  if (goalType === 'exam') {
    dayOne.push('Exam push: Complete one timed mini-test and mark weak points.');
  } else if (goalType === 'assignment') {
    dayOne.push('Assignment push: Finish one concrete deliverable section and proofread it.');
  } else {
    dayOne.push('Revision push: Create a one-page recap sheet for quick review later.');
  }

  return {
    dayOne,
    dayTwo: [
      'Revisit weak concepts for 30-45 minutes.',
      'Teach the topic out loud in simple language for 10 minutes.',
      'Prepare one question to ask in tutorial / office hours.',
    ],
    dayThree: [
      'Take a final self-quiz and compare with your Day 1 mistakes.',
      'Write a short exam-ready answer template for this topic.',
      assignmentPriorityHint(),
    ],
  };
}

function renderStudyPlan(subject, topic, goalType, startDate, minutes) {
  const tasks = buildStepByStepTasks(goalType, minutes);
  const dayOneDate = formatDate(startDate);
  const dayTwoDate = formatDate(addDays(startDate, 1));
  const dayThreeDate = formatDate(addDays(startDate, 2));

  aiOutput.innerHTML = `
    <h3>${subject}: ${topic}</h3>
    <p><strong>Goal:</strong> ${getGoalLabel(goalType)} · <strong>Session:</strong> ${minutes} minutes/day</p>
    <p><strong>Plan:</strong> 3-day college study sprint starting ${dayOneDate}</p>
    <p><strong>Subject helper:</strong> ${getSubjectHelper(subject, topic)}</p>
    <ol class="plan-days">
      <li>
        <strong>Day 1 - ${dayOneDate}</strong>
        <ul>
          ${tasks.dayOne.map((task) => `<li>${task}</li>`).join('')}
        </ul>
      </li>
      <li>
        <strong>Day 2 - ${dayTwoDate}</strong>
        <ul>
          ${tasks.dayTwo.map((task) => `<li>${task}</li>`).join('')}
        </ul>
      </li>
      <li>
        <strong>Day 3 - ${dayThreeDate}</strong>
        <ul>
          ${tasks.dayThree.map((task) => `<li>${task}</li>`).join('')}
        </ul>
      </li>
    </ol>
  `;

  studyHistory.push({
    subject,
    topic,
    goalLabel: getGoalLabel(goalType),
    minutes,
    startDate,
  });

  if (studyHistory.length > 15) {
    studyHistory = studyHistory.slice(-15);
  }

  saveHistory();
  renderHistory();
}

assignmentForm.addEventListener('submit', (event) => {
  event.preventDefault();

  assignments.push({
    id: crypto.randomUUID(),
    title: titleInput.value.trim(),
    dueDate: dueDateInput.value,
    done: false,
  });

  saveAssignments();
  assignmentForm.reset();
  titleInput.focus();
  renderAssignments();
});

aiForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const subject = subjectInput.value.trim();
  const topic = topicInput.value.trim();
  const goalType = goalInput.value;
  const startDate = startDateInput.value;
  const minutes = Number.parseInt(timeInput.value, 10);

  renderStudyPlan(subject, topic, goalType, startDate, minutes);
});

clearHistoryBtn.addEventListener('click', () => {
  studyHistory = [];
  saveHistory();
  renderHistory();
});

startDateInput.value = new Date().toISOString().slice(0, 10);

renderTimetable();
renderAssignments();
renderHistory();
