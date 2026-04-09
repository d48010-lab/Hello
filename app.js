const timetableItems = [
  { subject: 'Data Structures', time: '09:00 - 10:00', room: 'C-204' },
  { subject: 'Database Systems', time: '10:30 - 11:30', room: 'Lab-2' },
  { subject: 'Software Engineering', time: '12:00 - 13:00', room: 'B-101' },
];

const timetableList = document.getElementById('timetable');
const assignmentList = document.getElementById('assignmentList');
const assignmentCount = document.getElementById('assignmentCount');
const assignmentForm = document.getElementById('assignmentForm');
const titleInput = document.getElementById('titleInput');
const dueDateInput = document.getElementById('dueDateInput');

const aiForm = document.getElementById('aiForm');
const subjectInput = document.getElementById('subjectInput');
const topicInput = document.getElementById('topicInput');
const goalInput = document.getElementById('goalInput');
const timeInput = document.getElementById('timeInput');
const aiOutput = document.getElementById('aiOutput');

let assignments = [
  { id: crypto.randomUUID(), title: 'Computer Networks Quiz', dueDate: '2026-04-12' },
  { id: crypto.randomUUID(), title: 'OS Notes Submission', dueDate: '2026-04-15' },
];

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
  assignmentCount.textContent = `${assignments.length} pending`;
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
      li.className = 'item';
      li.innerHTML = `
        <div>
          <strong>${assignment.title}</strong><br />
          <small>Due: ${formatDate(assignment.dueDate)}</small>
        </div>
      `;

      const removeButton = document.createElement('button');
      removeButton.className = 'delete-btn';
      removeButton.type = 'button';
      removeButton.textContent = 'Remove';
      removeButton.addEventListener('click', () => {
        assignments = assignments.filter((item) => item.id !== assignment.id);
        renderAssignments();
      });

      li.appendChild(removeButton);
      assignmentList.appendChild(li);
    });

  updateCount();
}

function upcomingAssignmentHint() {
  if (assignments.length === 0) {
    return 'No urgent assignment detected. Use the last 10 minutes to prep tomorrow classes.';
  }

  const sorted = assignments.slice().sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const next = sorted[0];
  return `Priority checkpoint: ${next.title} is due on ${formatDate(next.dueDate)}.`;
}

function goalSpecificAction(goalType, minutes) {
  const shortBlock = Math.max(10, Math.round(minutes * 0.25));

  if (goalType === 'exam') {
    return `Exam sprint (${shortBlock} min): Solve timed past-paper questions and mark weak areas.`;
  }

  if (goalType === 'assignment') {
    return `Build output (${shortBlock} min): Complete one tangible part (section/code diagram) and submit a draft checkpoint.`;
  }

  return `Lecture recall (${shortBlock} min): Summarize today's lecture into a one-page cheat sheet.`;
}

function generateStudyPlan(subject, topic, goalType, minutes) {
  const safeMinutes = Number.isFinite(minutes) && minutes > 0 ? minutes : 60;
  const warmup = Math.max(10, Math.round(safeMinutes * 0.2));
  const deepWork = Math.max(20, Math.round(safeMinutes * 0.45));
  const activeRecall = Math.max(10, safeMinutes - warmup - deepWork);

  return [
    `College plan for ${subject} - ${topic}`,
    `Focus mode: ${goalType}. Total: ${safeMinutes} minutes.`,
    `1) Warm-up (${warmup} min): Review lecture slides and identify 3 likely professor questions.`,
    `2) Core study (${deepWork} min): Work through examples and write a clean summary in your own words.`,
    `3) Active recall (${activeRecall} min): Close notes and answer 5 self-test questions.`,
    `4) ${goalSpecificAction(goalType, safeMinutes)}`,
    `5) ${upcomingAssignmentHint()}`,
    '6) Campus strategy: Prepare one question to ask in the next tutorial/office hours.',
  ].join('\n');
}

assignmentForm.addEventListener('submit', (event) => {
  event.preventDefault();

  assignments.push({
    id: crypto.randomUUID(),
    title: titleInput.value.trim(),
    dueDate: dueDateInput.value,
  });

  assignmentForm.reset();
  titleInput.focus();
  renderAssignments();
});

aiForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const subject = subjectInput.value.trim();
  const topic = topicInput.value.trim();
  const goalType = goalInput.value;
  const minutes = Number.parseInt(timeInput.value, 10);

  const plan = generateStudyPlan(subject, topic, goalType, minutes);
  aiOutput.textContent = plan;
});

renderTimetable();
renderAssignments();
