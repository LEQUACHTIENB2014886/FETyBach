export default function (app) {
  app.directive('buttonAntiShake', {
    mounted(el, binding) {
      el.addEventListener('click', (e) => {
        el.classList.add('is-disabled');
        el.disabled = true;

        setTimeout(() => {
          el.disabled = false;
          el.classList.remove('is-disabled');
        }, 2000);
      });
    },
  });
}
