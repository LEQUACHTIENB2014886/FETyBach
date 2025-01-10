import { ref } from 'vue';
const inactivityTimeout = ref(null);
const remainingTime = ref(5 * 60);
const minutes = ref(null);
const seconds = ref(null);
const Timelogout = ref(null);
const handleLogout = async (store) => {
  try {
    await store.dispatch('user/logout');
    location.replace('/login');
  } catch (err) {
    console.error(err);
  }
};

function updateRemainingTime(store) {
  if (window.location.hash === '#/login?redirect=/') {
    clearInterval(inactivityTimeout.value);
    return;
  }
  const now = new Date();
  const timeDifference = Timelogout.value - now;
  minutes.value = Math.floor(timeDifference / 1000 / 60);
  seconds.value = Math.floor((timeDifference / 1000) % 60);
  // const mess = `${minutes.value}:${seconds.value < 10 ? '0' : ''}${seconds.value}`;
  // console.clear();
  // console.log(`${mess}`);
  if (timeDifference <= 0) {
    clearInterval(inactivityTimeout.value);
    handleLogout(store);
  }
}

function scheduleLogout(store) {
  clearInterval(inactivityTimeout.value);
  inactivityTimeout.value = setInterval(() => {
    updateRemainingTime(store);
  }, 1000);
}

function resetInactivityTimer(store) {
  const date = new Date();
  Timelogout.value = new Date(date.getTime() + 5 * 60 * 1000);
  scheduleLogout(store);
}
function handleVisibilityChange(store) {
  if (document.hidden) {
    resetInactivityTimer(store);
  }
}

export { handleLogout, resetInactivityTimer, handleVisibilityChange, minutes, seconds };
