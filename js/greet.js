// Greeting based on time of day — inserts into #greeting-text element
(function() {
  var hrs = new Date().getHours();
  var msg = '';

  if (hrs < 12)               msg = 'Good Morning !';
  else if (hrs >= 12 && hrs < 17) msg = 'Good Afternoon !';
  else                         msg = 'Good Evening !';

  // Wait for DOM then insert
  function insert() {
    var el = document.getElementById('greeting-text');
    if (el) el.textContent = msg;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', insert);
  } else {
    insert();
  }
})();
