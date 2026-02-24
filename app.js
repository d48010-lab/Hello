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

let assignments = [
  { id: crypto.randomUUID(), title: 'Computer Networks Quiz', dueDate: '2026-03-01' },
  { id: crypto.randomUUID(), title: 'OS Notes Submission', dueDate: '2026-03-03' },
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

renderTimetable();
renderAssignments();
