document.addEventListener("DOMContentLoaded", function () {
  var typewriterElement = document.querySelector(".Typewriter__wrapper");

  if (!typewriterElement) {
    return;
  }

  var dataText = [
    "Modern C++ Programming",
    "Object Oriented Programming",
    "Game Development",
    "Python Programming",
    "MySQL & DBMS",
    "Operating Systems",
    "Software Engineering",
  ];

  // var reducedMotion = //window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // var typingDelay = reducedMotion ? 90 : 45;
  // var deletingDelay = reducedMotion ? 60 : 30;
  // var holdDelay = reducedMotion ? 1000 : 1500;
  // var restartDelay = reducedMotion ? 1000 : 500;
  var typingDelay = 45;
  var deletingDelay = 30;
  var holdDelay = 1500;
  var restartDelay = 500;

  var itemIndex = 0;
  var charIndex = 0;
  var deleting = false;

  function tick() {
    var currentText = dataText[itemIndex];

    if (deleting) {
      charIndex -= 1;
    } else {
      charIndex += 1;
    }

    typewriterElement.innerHTML = "<i>" + currentText.substring(0, charIndex) + " |> </i>";

    var delay = deleting ? deletingDelay : typingDelay;

    if (!deleting && charIndex === currentText.length) {
      delay = holdDelay;
      deleting = true;
    } else if (deleting && charIndex === 0) {
      deleting = false;
      itemIndex = (itemIndex + 1) % dataText.length;
      delay = restartDelay;
    }

    window.setTimeout(tick, delay);
  }

  tick();
});