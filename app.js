// Pomodoro Timer and Tabs
let timer;
let countdown;
let currentMode = 'pomodoro';
let isRunning = false;

const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const settingsButton = document.getElementById('settings');
const uploadButton = document.getElementById('upload');
const uploadInput = document.getElementById('upload-input');
const minutesSpan = document.getElementById('minutes');
const secondsSpan = document.getElementById('seconds');
const wallpaperGrid = document.getElementById('wallpaper-grid');
const alarmSoundSelect = document.getElementById('alarm-sound');
const soundAlertToggle = document.getElementById('sound-alert-toggle');
const audio = new Audio();

const tabs = document.querySelectorAll('.tab');

// Modal elements
const modal = document.getElementById('settings-modal');
const closeButton = document.getElementById('close-modal');
const resetSettingsButton = document.getElementById('reset-settings');
const saveSettingsButton = document.getElementById('save-settings');

// Fullscreen functionality
const fullscreenButton = document.getElementById('fullscreen');
fullscreenButton.addEventListener('click', toggleFullscreen);

// Dark mode functionality
const darkModeToggle = document.getElementById('dark-mode-toggle');
darkModeToggle.addEventListener('click', toggleDarkMode);

// Notification Modal elements
const notificationModal = document.getElementById('notification-modal');
const notificationOkButton = document.getElementById('notification-ok-button');
notificationOkButton.addEventListener('click', () => {
    audio.pause();
    audio.currentTime = 0;
    notificationModal.style.display = 'none';
});

// Open modal
settingsButton.addEventListener('click', () => {
    settingsButton.classList.add('is-rotating');
    setTimeout(() => {
        modal.style.display = 'block';
        settingsButton.classList.remove('is-rotating');
    }, 500);
});

// Close modal
closeButton.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Close modal when clicking outside of the modal content
window.addEventListener('click', (event) => {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
});

// Toggle between settings tabs
const settingsTabs = document.querySelectorAll('.settings-tab');
settingsTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        settingsTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const tabContentId = tab.getAttribute('data-tab');
        document.querySelectorAll('.settings-content').forEach(content => {
            content.style.display = 'none';
        });
        document.getElementById(tabContentId).style.display = 'flex';
    });
});

// Load the saved background image on page load
window.addEventListener('load', () => {
    const savedImage = localStorage.getItem('backgroundImage');
    if (savedImage) {
        document.body.style.backgroundImage = `url(${savedImage})`;
        document.querySelector('.overlay').style.display = 'block';
        if (!document.body.classList.contains('theme-dark')) {
            document.body.classList.add('theme-dark');
            document.body.classList.remove('theme-light');
            darkModeToggle.classList.add('is-active');
        }
    }

    const savedWallpaper = localStorage.getItem('selectedWallpaper');
    if (savedWallpaper) {
        document.body.style.backgroundImage = `url(${savedWallpaper})`;
        document.querySelector('.overlay').style.display = 'block';
    }

    const selectedAlarmSound = (localStorage.getItem('selectedAlarmSound') || 'audio/sound1.mp3');
    alarmSoundSelect.value = selectedAlarmSound;
    audio.src = selectedAlarmSound;

    const soundAlert = localStorage.getItem('soundAlert') === 'true';
    soundAlertToggle.checked = soundAlert;
});

let customPomodoroTime = localStorage.getItem('pomodoroTime') || 25;
let customShortBreakTime = localStorage.getItem('shortBreakTime') || 5;
let customLongBreakTime = localStorage.getItem('longBreakTime') || 15;

document.getElementById('pomodoro-time').value = customPomodoroTime;
document.getElementById('short-break-time').value = customShortBreakTime;
document.getElementById('long-break-time').value = customLongBreakTime;

// Dark mode toggle function
function toggleDarkMode() {
    const body = document.body;

    body.classList.toggle('theme-dark');
    body.classList.toggle('theme-light');
    darkModeToggle.classList.toggle('is-active');

    if (!body.classList.contains('theme-dark')) {
        body.style.backgroundImage = '';
        localStorage.removeItem('backgroundImage');
        document.querySelector('.overlay').style.display = 'none';
    }
}

// Fullscreen toggle function
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().then(() => {
            fullscreenButton.classList.add('is-fullscreen');
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen().then(() => {
                fullscreenButton.classList.remove('is-fullscreen');
            });
        }
    }
}

// Timer tab switch function
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentMode = tab.getAttribute('data-tab');
        resetTimer();
    });
});

// Toggle timer function
startButton.addEventListener('click', toggleTimer);
resetButton.addEventListener('click', () => {
    resetTimer();
    resetButton.classList.add('is-rotating');
    setTimeout(() => {
        resetButton.classList.remove('is-rotating');
    }, 500);
});

uploadButton.addEventListener('click', () => {
    uploadInput.click();
    uploadButton.classList.add('is-rotating');
    setTimeout(() => {
        uploadButton.classList.remove('is-rotating');
    }, 500);
});

uploadInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const imageUrl = e.target.result;
            document.body.style.backgroundImage = `url(${imageUrl})`;
            localStorage.setItem('backgroundImage', imageUrl);

            document.querySelector('.overlay').style.display = 'block';

            if (!document.body.classList.contains('theme-dark')) {
                document.body.classList.add('theme-dark');
                document.body.classList.remove('theme-light');
                darkModeToggle.classList.add('is-active');
            }
        };
        reader.readAsDataURL(file);
    }
});

const wallpapers = [
    'images/wallpaper1.jpg',
    'images/wallpaper2.png',
    'images/wallpaper3.jpg',
    'images/wallpaper4.jpg',
    'images/wallpaper5.jpg',
    'images/wallpaper6.jpg',
    'images/wallpaper7.jpg',
    'images/wallpaper8.jpg',
    'images/wallpaper9.jpg',
    'images/wallpaper10.jpg',
    'images/wallpaper11.jpg',
    'images/wallpaper12.jpg',
];

wallpapers.forEach(wallpaper => {
    const wallpaperDiv = document.createElement('div');
    wallpaperDiv.classList.add('wallpaper-option');
    wallpaperDiv.innerHTML = `<img src="${wallpaper}" alt="Wallpaper">`;
    wallpaperDiv.addEventListener('click', () => {
        document.body.style.backgroundImage = `url(${wallpaper})`;
        localStorage.setItem('selectedWallpaper', wallpaper);

        document.querySelector('.overlay').style.display = 'block';

        if (!document.body.classList.contains('theme-dark')) {
            document.body.classList.add('theme-dark');
            document.body.classList.remove('theme-light');
            darkModeToggle.classList.add('is-active');
        }
    });
    wallpaperGrid.appendChild(wallpaperDiv);
});

function toggleTimer() {
    if (isRunning) {
        clearInterval(countdown);
        startButton.textContent = 'start';
        isRunning = false;
    } else {
        startTimer();
        startButton.textContent = 'pause';
        isRunning = true;
    }
}

function startTimer() {
    clearInterval(countdown);
    let time;
    if (currentMode === 'pomodoro') {
        time = customPomodoroTime * 60;
    } else if (currentMode === 'short-break') {
        time = customShortBreakTime * 60;
    } else if (currentMode === 'long-break') {
        time = customLongBreakTime * 60;
    }

    countdown = setInterval(() => {
        time--;
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        minutesSpan.textContent = minutes < 10 ? '0' + minutes : minutes;
        secondsSpan.textContent = seconds < 10 ? '0' + seconds : seconds;

        if (time <= 0) {
            clearInterval(countdown);
            startButton.textContent = 'start';
            isRunning = false;
            if (soundAlertToggle.checked) {
                audio.play();
            }
            showNotification();
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(countdown);
    isRunning = false;
    startButton.textContent = 'start';
    if (currentMode === 'pomodoro') {
        minutesSpan.textContent = customPomodoroTime < 10 ? '0' + customPomodoroTime : customPomodoroTime;
        secondsSpan.textContent = '00';
    } else if (currentMode === 'short-break') {
        minutesSpan.textContent = customShortBreakTime < 10 ? '0' + customShortBreakTime : customShortBreakTime;
        secondsSpan.textContent = '00';
    } else if (currentMode === 'long-break') {
        minutesSpan.textContent = customLongBreakTime < 10 ? '0' + customLongBreakTime : customLongBreakTime;
        secondsSpan.textContent = '00';
    }
}

function showNotification() {
    notificationModal.style.display = 'block';
}

closeButton.addEventListener('click', () => {
    modal.style.display = 'none';
});

resetSettingsButton.addEventListener('click', () => {
    localStorage.removeItem('backgroundImage');
    document.body.style.backgroundImage = '';
    document.querySelector('.overlay').style.display = 'none';
    if (document.body.classList.contains('theme-light')) {
        toggleDarkMode();
    }
});

saveSettingsButton.addEventListener('click', saveSettings);

function saveSettings() {
    customPomodoroTime = document.getElementById('pomodoro-time').value;
    customShortBreakTime = document.getElementById('short-break-time').value;
    customLongBreakTime = document.getElementById('long-break-time').value;

    const selectedAlarmSound = alarmSoundSelect.value;
    localStorage.setItem('selectedAlarmSound', selectedAlarmSound);
    audio.src = selectedAlarmSound;

    const soundAlert = soundAlertToggle.checked;
    localStorage.setItem('soundAlert', soundAlert);

    localStorage.setItem('pomodoroTime', customPomodoroTime);
    localStorage.setItem('shortBreakTime', customShortBreakTime);
    localStorage.setItem('longBreakTime', customLongBreakTime);
    
    modal.style.display = 'none';

    resetTimer();
}

resetTimer();

// Keyboard shortcuts
document.addEventListener('keydown', (event) => {
    switch(event.code) {
        case 'KeyF':
        case 'ArrowUp':
            toggleFullscreen();
            break;
        case 'KeyP':
            switchTab('pomodoro');
            break;
        case 'KeyS':
            switchTab('short-break');
            break;
        case 'KeyL':
            switchTab('long-break');
            break;
        case 'Space':
            toggleTimer();
            break;
        case 'Enter':
            resetTimer();
            resetButton.classList.add('is-rotating');
            setTimeout(() => {
                resetButton.classList.remove('is-rotating');
            }, 500);
            break;
        case 'ArrowLeft':
            changeTabDirection(-1);
            break;
        case 'ArrowRight':
            changeTabDirection(1);
            break;
        case 'ArrowDown':
            document.querySelector('.spotify-player iframe').contentWindow.postMessage({method: 'toggle'}, '*');
            break;
    }
});

function switchTab(mode) {
    tabs.forEach(tab => {
        if (tab.getAttribute('data-tab') === mode) {
            tab.click();
        }
    });
}

function changeTabDirection(direction) {
    const activeTab = document.querySelector('.tab.active');
    let newIndex = [...tabs].indexOf(activeTab) + direction;
    newIndex = (newIndex + tabs.length) % tabs.length;
    tabs[newIndex].click();
}