// ===========================
// APP.JS — Main application logic
// Particle system, scroll animations, navbar, interactivity
// ===========================

document.addEventListener('DOMContentLoaded', function() {

  // ---- PARTICLE SYSTEM (Purple/Red theme) ----
  (function initParticles() {
    var canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var particles = [];
    var mouse = { x: null, y: null, radius: 150 };
    var particleCount = 70;
    var connectionDistance = 150;
    var animId;

    // Colors: red, pink, purple
    var colors = [
      { r: 218, g: 15, b: 42 },   // red
      { r: 233, g: 30, b: 99 },   // pink
      { r: 156, g: 39, b: 176 },  // purple
      { r: 244, g: 67, b: 54 },   // bright red
    ];

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    if (window.innerWidth < 768) {
      particleCount = 35;
      connectionDistance = 100;
    }

    function Particle() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.radius = Math.random() * 2.5 + 0.5;
      this.opacity = Math.random() * 0.5 + 0.15;
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    Particle.prototype.update = function() {
      // Mouse repulsion
      if (mouse.x !== null) {
        var dx = this.x - mouse.x;
        var dy = this.y - mouse.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          var force = (mouse.radius - dist) / mouse.radius;
          this.x += dx * force * 0.02;
          this.y += dy * force * 0.02;
        }
      }

      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    };

    Particle.prototype.draw = function() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + this.color.r + ',' + this.color.g + ',' + this.color.b + ',' + this.opacity + ')';
      ctx.fill();
    };

    for (var i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function drawConnections() {
      for (var i = 0; i < particles.length; i++) {
        for (var j = i + 1; j < particles.length; j++) {
          var dx = particles[i].x - particles[j].x;
          var dy = particles[i].y - particles[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            var opacity = (1 - dist / connectionDistance) * 0.12;
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(233, 30, 99, ' + opacity + ')';
            ctx.lineWidth = 0.8;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (var i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      
      drawConnections();
      animId = requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener('mousemove', function(e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', function() {
      mouse.x = null;
      mouse.y = null;
    });
  })();

  // ---- NAVBAR SCROLL EFFECT ----
  (function initNavbar() {
    var navbar = document.querySelector('.navbar');
    var navToggle = document.querySelector('.nav-toggle');
    var navLinks = document.querySelector('.nav-links');
    var links = document.querySelectorAll('.nav-links a');

    function handleScroll() {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    if (navToggle) {
      navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('open');
      });
    }

    links.forEach(function(link) {
      link.addEventListener('click', function() {
        if (navToggle) navToggle.classList.remove('active');
        if (navLinks) navLinks.classList.remove('open');
      });
    });

    // Active nav link highlighting on scroll
    var sections = document.querySelectorAll('section[id]');

    function updateActiveLink() {
      var scrollY = window.scrollY + 150;

      sections.forEach(function(section) {
        var top = section.offsetTop;
        var height = section.offsetHeight;
        var id = section.getAttribute('id');

        if (scrollY >= top && scrollY < top + height) {
          links.forEach(function(link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + id) {
              link.classList.add('active');
            }
          });
        }
      });
    }

    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink();
  })();

  // ---- SCROLL REVEAL ANIMATIONS ----
  (function initReveal() {
    var reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

    if (!('IntersectionObserver' in window)) {
      reveals.forEach(function(el) { el.classList.add('visible'); });
      return;
    }

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(function(el) {
      observer.observe(el);
    });
  })();

  // ---- SMOOTH SCROLL FOR NAV LINKS ----
  (function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
      anchor.addEventListener('click', function(e) {
        var targetId = this.getAttribute('href');
        if (targetId === '#') return;

        var target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  })();

  // ---- PROJECT CARD TILT EFFECT ----
  (function initCardTilt() {
    var cards = document.querySelectorAll('.project-card');

    cards.forEach(function(card) {
      card.addEventListener('mousemove', function(e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var centerX = rect.width / 2;
        var centerY = rect.height / 2;
        var rotateX = (y - centerY) / centerY * -3;
        var rotateY = (x - centerX) / centerX * 3;

        card.style.transform = 'translateY(-10px) perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
      });

      card.addEventListener('mouseleave', function() {
        card.style.transform = '';
      });
    });
  })();

  // ---- MAGNETIC SOCIAL LINKS ----
  (function initMagnetic() {
    var links = document.querySelectorAll('.social-link');

    links.forEach(function(link) {
      link.addEventListener('mousemove', function(e) {
        var rect = link.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        link.style.transform = 'translateY(-5px) translate(' + x * 0.3 + 'px, ' + y * 0.3 + 'px)';
      });

      link.addEventListener('mouseleave', function() {
        link.style.transform = '';
      });
    });
  })();

});
