// Typewriter effect — targets #typewriter element
(function() {
  var dataText = [
    'Modern C++ Programming',
    'Object Oriented Programming',
    'Game Development',
    'Python Programming',
    'MySQL & DBMS',
    'Operating Systems',
    'Software Engineering',
  ];

  var el = null;
  var textIndex = 0;
  var charIndex = 0;
  var isDeleting = false;
  var typeSpeed = 60;
  var deleteSpeed = 35;
  var pauseEnd = 1800;
  var pauseStart = 400;

  function tick() {
    if (!el) return;

    var currentText = dataText[textIndex];
    
    if (isDeleting) {
      charIndex--;
      el.textContent = currentText.substring(0, charIndex);
    } else {
      charIndex++;
      el.textContent = currentText.substring(0, charIndex);
    }

    var delay = isDeleting ? deleteSpeed : typeSpeed;

    if (!isDeleting && charIndex === currentText.length) {
      delay = pauseEnd;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % dataText.length;
      delay = pauseStart;
    }

    setTimeout(tick, delay);
  }

  function init() {
    el = document.getElementById('typewriter');
    if (el) tick();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();