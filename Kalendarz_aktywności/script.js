let navigation = 0;
let clickedDate = null;
let clickedActivityIndex = null;
let activities = getActivities() || [];

const calendar = document.getElementById('calendar');
const newActivityModal = document.getElementById('newActivityModal');
const editActivityModal = document.getElementById('editActivityModal');
const backDrop = document.getElementById('modalBackDrop');
const activityTitleInput = document.getElementById('activityTitleInput');
const editActivityTitleInput = document.getElementById('editActivityTitleInput');
const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function openModal(date) {
    clickedDate = date;
    newActivityModal.style.display = 'block';
    backDrop.style.display = 'block';
}

function openEditModal(activityIndex) {
    clickedActivityIndex = activityIndex;
    editActivityTitleInput.value = activities[clickedActivityIndex].title;
    editActivityModal.style.display = 'block';
    backDrop.style.display = 'block';
}

function load() {
    const currentDate = new Date();

    if (navigation !== 0) {
        currentDate.setMonth(new Date().getMonth() + navigation);
    }

    const day = currentDate.getDate();
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();

    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const dateString = firstDayOfMonth.toLocaleDateString('en-us', {
        weekday: 'long',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    });

    const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);

    document.getElementById('monthDisplay').innerHTML =
        `${currentDate.toLocaleDateString('pl-PL', { month: 'long' })} ${year}`;

    calendar.innerHTML = '';

    for (let i = 1; i <= paddingDays + daysInMonth; i++) {
        const daySquare = document.createElement('div');
        daySquare.classList.add('day');

        const dayString = `${month + 1}/${i - paddingDays}/${year}`;

        if (i > paddingDays) {
            daySquare.innerText = i - paddingDays;
            const dayActivities = activities.filter(activity => activity.date === dayString);

            if (i - paddingDays === day && navigation === 0) {
                daySquare.id = 'currentDay';
            }

            if (dayActivities.length > 0) {
                dayActivities.forEach((activity, index) => {
                    const activityDiv = document.createElement('div');
                    activityDiv.classList.add('activity');
                    activityDiv.innerText = activity.title;
                    activityDiv.addEventListener('click', (e) => {
                        e.stopPropagation();
                        openEditModal(activities.findIndex(act => act.id === activity.id));
                    });
                    daySquare.appendChild(activityDiv);
                });
            }

            daySquare.addEventListener('click', () => openModal(dayString));
        } else {
            daySquare.classList.add('padding');
        }

        calendar.appendChild(daySquare);
    }
}

function closeModal() {
    activityTitleInput.classList.remove('error');
    newActivityModal.style.display = 'none';
    editActivityModal.style.display = 'none';
    backDrop.style.display = 'none';
    activityTitleInput.value = '';
    editActivityTitleInput.value = '';
    clickedDate = null;
    clickedActivityIndex = null;
    load();
}

function saveActivity() {
    if (activityTitleInput.value) {
        activityTitleInput.classList.remove('error');
        const newActivity = {
            id: activities.length > 0 ? activities[activities.length - 1].id + 1 : 1,
            date: clickedDate,
            title: activityTitleInput.value,
        };
        activities.push(newActivity);
        saveActivitiesToLocalStorage(activities);
        closeModal();
    } else {
        activityTitleInput.classList.add('error');
    }
}

function editActivity() {
    if (editActivityTitleInput.value) {
        editActivityTitleInput.classList.remove('error');
        activities[clickedActivityIndex].title = editActivityTitleInput.value;
        saveActivitiesToLocalStorage(activities);
        closeModal();
    } else {
        editActivityTitleInput.classList.add('error');
    }
}

function deleteActivity() {
    activities.splice(clickedActivityIndex, 1);
    saveActivitiesToLocalStorage(activities);
    closeModal();
}

function getActivities() {
    return JSON.parse(localStorage.getItem('activities'));
}

function saveActivitiesToLocalStorage(activities) {
    localStorage.setItem('activities', JSON.stringify(activities));
}

function initButtons() {
    document.getElementById('nextButton').addEventListener('click', () => {
        navigation++;
        load();
    });

    document.getElementById('backButton').addEventListener('click', () => {
        navigation--;
        load();
    });

    document.getElementById('saveButton').addEventListener('click', saveActivity);
    document.getElementById('cancelButton').addEventListener('click', closeModal);
    document.getElementById('editSaveButton').addEventListener('click', editActivity);
    document.getElementById('editCancelButton').addEventListener('click', closeModal);
    document.getElementById('deleteButton').addEventListener('click', deleteActivity);
}

initButtons();
load();
