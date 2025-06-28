import flatpickr from 'flatpickr';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import 'flatpickr/dist/flatpickr.min.css';

const input = document.querySelector('#datetime-picker');
const startButton = document.querySelector('button[data-start]');
const day = document.querySelector('span[data-days]');
const hour = document.querySelector('span[data-hours]');
const minute = document.querySelector('span[data-minutes]');
const second = document.querySelector('span[data-seconds]');

startButton.disabled = true;


let userSelectedDate = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
      const currentDate = new Date();
      if (selectedDates[0] < currentDate) {
          iziToast.error({
              title: 'Error',
              message: 'Please choose a date in the future',
              position: 'topRight',
          });
          startButton.disabled = true;
      } else {
          startButton.disabled = false;
          userSelectedDate = selectedDates[0];
          console.log(`Selected date: ${userSelectedDate}`);
      }
  },
};
const timer = flatpickr('#datetime-picker', options);  

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}


function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

startButton.addEventListener('click', () => {
  startButton.disabled = true;
  input.disabled = true;
    
  const timerId = setInterval(() => {
    const currentDate = new Date();
    const timeDifference = userSelectedDate - new Date();

    if (timeDifference <= 0) {
      clearInterval(timerId);
      day.textContent = '00';
      hour.textContent = '00';
      minute.textContent = '00';
      second.textContent = '00';
      iziToast.success({
        title: 'Success',
        message: 'The countdown has ended!',
        position: 'topRight',
      });
      return;
    }

    const { days, hours, minutes, seconds } = convertMs(timeDifference);
    day.textContent = addLeadingZero(days);
    hour.textContent = addLeadingZero(hours);
    minute.textContent = addLeadingZero(minutes);
    second.textContent = addLeadingZero(seconds);
  }, 1000);
});