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
const startDateInput = document.getElementById('startDateInput');
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

function getGoalLabel(goalType) {
  if (goalType === 'exam') {
    return 'Exam Prep';
  }

  if (goalType === 'assignment') {
    return 'Assignment Work';
  }

  return 'Lecture Revision';
}

function assignmentPriorityHint() {
  if (assignments.length === 0) {
    return 'No pending assignment pressure right now. Use 10 minutes to organize next week topics.';
  }

  const sorted = assignments.slice().sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const next = sorted[0];
  return `Nearest deadline: ${next.title} (${formatDate(next.dueDate)}).`;
}

function subjectHelper(subject, goalType) {
  const normalized = subject.trim().toLowerCase();

  const helperBySubject = {
    chemistry: {
      concept: 'Practice balancing reactions and write one mechanism flow each session.',
      recall: 'Create flashcards for named reactions and periodic trends.',
    },
    botany: {
      concept: 'Draw labeled plant anatomy diagrams from memory.',
      recall: 'Link each process (photosynthesis/transpiration) to real examples.',
    },
    zoology: {
      concept: 'Use comparison tables for phyla, organs, and adaptations.',
      recall: 'Review life-cycle diagrams and classify specimen examples.',
    },
    mathematics: {
      concept: 'Solve problems in increasing difficulty, then verify each step.',
      recall: 'Keep an error log for common algebra/calculus mistakes.',
    },
    physics: {
      concept: 'Start with formulas, then apply dimensional analysis before solving.',
      recall: 'Explain each solved problem with units and assumptions.',
    },
    english: {
      concept: 'Annotate one passage and identify theme, tone, and evidence.',
      recall: 'Write one concise paragraph with claim-evidence-analysis structure.',
    },
    biology: {
      concept: 'Map processes (cell cycle/genetics/physiology) as flowcharts.',
      recall: 'Do quick active-recall quizzes for terminology and functions.',
    },
  };

  const selected = helperBySubject[normalized];

  if (!selected) {
    return `For ${subject}, use: concept drill + active recall + one teaching summary.`;
  }

  if (goalType === 'assignment') {
    return `${selected.concept} Then convert it into assignment-ready notes/diagrams.`;
  }

  return `${selected.concept} ${selected.recall}`;
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
    <p><strong>Subject Helper:</strong> ${subjectHelper(subject, goalType)}</p>
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
  const startDate = startDateInput.value;
  const minutes = Number.parseInt(timeInput.value, 10);

  renderStudyPlan(subject, topic, goalType, startDate, minutes);
});

startDateInput.value = new Date().toISOString().slice(0, 10);

renderTimetable();
renderAssignments();
