//loading
window.addEventListener('load', function () {
  const loader = document.querySelector('.loader-bar');
  const loaderContainer = document.querySelector('.loader-container');

  let progress = 0;
  const interval = setInterval(function () {
    progress += Math.random() * 20;
    if (progress > 100) {
      clearInterval(interval);
      loader.style.width = '100%';
      setTimeout(function () {
        loaderContainer.classList.add('loaded');
      }, 500);
    } else {
      loader.style.width = progress + '%';
    }
  }, 300);
});



document.addEventListener('DOMContentLoaded', function () {




//particles

  particlesJS("particles-js", {
  particles: {
    number: {
      value: 110,
      density: {
        enable: true,
        value_area: 800
      }
    },
    color: {
      value: "#ff0000"
    },
    shape: {
      type: "circle",
      stroke: {
        width: 0,
        color: "#000000"
      },
      polygon: {
        nb_sides: 5
      },
      image: {
        src: "img/github.svg",
        width: 100,
        height: 100
      }
    },
    opacity: {
      value: 0.6,
      random: false,
      anim: {
        enable: false,
        speed: 1,
        opacity_min: 0.2,
        sync: false
      }
    },
    size: {
      value: 5,
      random: true,
      anim: {
        enable: false,
        speed: 40,
        size_min: 0.1,
        sync: false
      }
    },
    line_linked: {
      enable: true,
      distance: 150,
      color: "#ff0000",
      opacity: 0.5,
      width: 1
    },
    move: {
      enable: true,
      speed: 4,
      direction: "none",
      random: false,
      straight: false,
      out_mode: "out",
      bounce: false,
      attract: {
        enable: false,
        rotateX: 600,
        rotateY: 1200
      }
    }
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: {
        enable: true,
        mode: "repulse"
      },
      onclick: {
        enable: true,
        mode: "push"
      },
      resize: true
    },
    modes: {
      grab: {
        distance: 400,
        line_linked: {
          opacity: 1
        }
      },
      bubble: {
        distance: 400,
        size: 40,
        duration: 2,
        opacity: 8,
        speed: 3
      },
      repulse: {
        distance: 200
      },
      push: {
        particles_nb: 4
      },
      remove: {
        particles_nb: 2
      }
    }
  },
  retina_detect: true
});







//custom cursor + idle
  const cursor = document.querySelector('#cursor');
  const circle = document.querySelector('#circle1');

  const mouseX = (event) => event.clientX;
  const mouseY = (event) => event.clientY;

  const positionElement = (event) => {
    const mouse = {
      x: mouseX(event),
      y: mouseY(event),
    };

    cursor.style.top = mouse.y + 'px';
    cursor.style.left = mouse.x + 'px';
  };

  let timer = false;

  window.onmousemove = (event) => {
    const _event = event;

    if (timer) clearTimeout(timer);

    timer = setTimeout(() => {
      positionElement(_event);
    }, 4); 
  };

  const interactiveElements = document.querySelectorAll('a, button, .projects-aside, .scratch-box, input[type="submit"]');

  interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
      circle.style.transform = 'scale(3)'; 
    });

    element.addEventListener('mouseleave', () => {
      circle.style.transform = 'scale(1)'; 
    });
  });

    let idleTimer = null;
    let idleState = false;
  
    function setIdleTimer(time) {
      clearTimeout(idleTimer);
      idleState = false;
      idleTimer = setTimeout(function() {
        circle.classList.add('pulse');
        idleState = true;
      }, time);
    }
  
    function removePulseClass() {
      if (idleState) {
        circle.classList.remove('pulse');
        idleState = false;
      }
    }
  
 
    setIdleTimer(25000);
  
    
    function activityDetected() {
      removePulseClass(); 
      setIdleTimer(25000);
    }
  

    window.addEventListener('mousemove', activityDetected);
    window.addEventListener('scroll', activityDetected);
  });

  const tabButtons = document.querySelectorAll('.tab-btn')

  tabButtons.forEach((tab) => {
    tab.addEventListener('click', () => tabClicked(tab))
  })
  
  function tabClicked(tab) {
    
    tabButtons.forEach(tab => {
      tab.classList.remove('active')
    })
    tab.classList.add('active')
    
    const contents = document.querySelectorAll('.content')
    
    contents.forEach((content) => {
      content.classList.remove('show')
    })
    
    const contentId = tab.getAttribute('content-id')
    const contentSelected = document.getElementById(contentId)
    
    contentSelected.classList.add('show')
  }
  

//scratch card
// Select the canvas, image, and other elements
const canvas = document.getElementById('scratchCanvas');
const context = canvas.getContext('2d');
const revealImage = document.querySelector('.reveal-image');
let isPointerDown = false;
let positionX;
let positionY;
let clearDetectionTimeout = null;

const devicePixelRatio = window.devicePixelRatio || 1;

// Load the cover image (drawing.jpg)
const coverImage = new Image();
coverImage.src = 'images/drawing.jpg';  // Path to your cover image

coverImage.onload = () => {
  adjustCanvasSize();
};

// Adjust canvas size to match the image dimensions
function adjustCanvasSize() {
  const imageWidth = revealImage.offsetWidth;
  const imageHeight = revealImage.offsetHeight;

  // Set canvas dimensions based on the image
  canvas.width = imageWidth * devicePixelRatio;
  canvas.height = imageHeight * devicePixelRatio;
  canvas.style.width = `${imageWidth}px`;
  canvas.style.height = `${imageHeight}px`;

  // Scale the canvas for high-DPI devices
  context.scale(devicePixelRatio, devicePixelRatio);

  // Draw the cover image (drawing.jpg) over the canvas
  context.drawImage(coverImage, 0, 0, imageWidth, imageHeight);

  // Set global composite operation to make scratch-off work
  context.globalCompositeOperation = 'destination-out';
}

// Handle the start of scratching
canvas.addEventListener('pointerdown', (e) => {
  ({ x: positionX, y: positionY } = getPosition(e));
  clearTimeout(clearDetectionTimeout);
  isPointerDown = true;

  canvas.addEventListener('pointermove', plot);  // Track movement during scratching

  window.addEventListener('pointerup', () => {
    canvas.removeEventListener('pointermove', plot);
    isPointerDown = false;
    clearDetectionTimeout = setTimeout(() => {
      checkScratchCompletion();
    }, 500);
  }, { once: true });
});

// Get mouse/touch position relative to the canvas
const getPosition = ({ clientX, clientY }) => {
  const { left, top } = canvas.getBoundingClientRect();
  return {
    x: clientX - left,
    y: clientY - top,
  };
};

// Plot the line for smooth scratching effect
const plotLine = (context, x1, y1, x2, y2) => {
  var diffX = Math.abs(x2 - x1);
  var diffY = Math.abs(y2 - y1);
  var dist = Math.sqrt(diffX * diffX + diffY * diffY);
  var step = dist / 50;  // Controls the density of the scratch
  var i = 0;
  var t;
  var x;
  var y;

  while (i < dist) {
    t = Math.min(1, i / dist);

    x = x1 + (x2 - x1) * t;
    y = y1 + (y2 - y1) * t;

    context.beginPath();
    context.arc(x, y, 16, 0, Math.PI * 4);  // Radius of the scratch effect
    context.fill();

    i += step;
  }
};

// Function to handle scratching (plot the path)
const plot = (e) => {
  const { x, y } = getPosition(e);
  plotLine(context, positionX, positionY, x, y);
  positionX = x;
  positionY = y;
};

// Check how much of the canvas has been scratched off
const checkScratchCompletion = () => {
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const pixelData = imageData.data;

  let clearedPixelCount = 0;

  // Count transparent (cleared) pixels
  for (let i = 0; i < pixelData.length; i += 4) {
    const alpha = pixelData[i + 3];  // Alpha channel to detect transparency
    if (alpha === 0) {
      clearedPixelCount++;
    }
  }

  const clearedPercentage = clearedPixelCount * 100 / (canvas.width * canvas.height);

  if (clearedPercentage >= 25) {
    revealImage.style.opacity = 1;  // Show the underlying image
    canvas.classList.add('hidden');  // Hide the canvas once the scratch is complete
  }
};




window.addEventListener("load", function() {
let container = document.querySelector(".horizontal");
let containerWidth = container.scrollWidth - window.innerWidth;

gsap.registerPlugin(ScrollTrigger);

const horizontalSections = gsap.utils.toArray('section.horizontal');

horizontalSections.forEach(function (sec) {  
  const thisPinWrap = sec.querySelector('.pin-wrap');
  const thisAnimWrap = thisPinWrap.querySelector('.animation-wrap');
  
  const getToValue = () => -(thisAnimWrap.scrollWidth - window.innerWidth); 

  gsap.fromTo(thisAnimWrap, { 
    x: () => thisAnimWrap.classList.contains('to-right') ? 0 : getToValue() 
  }, { 
    x: () => thisAnimWrap.classList.contains('to-right') ? getToValue() : 0, 
    ease: "none",
    scrollTrigger: {
      trigger: sec,   
      start: "top top",
      end: () => "+=" + (thisAnimWrap.scrollWidth - window.innerWidth),
      pin: thisPinWrap,
      invalidateOnRefresh: true,
      scrub: true,
    }
  });
});
const scratchCardImage = document.querySelector('.scratch-card-image');

if (scratchCardImage) {
  scratchCardImage.classList.add('animate');
} else {
  console.error("scratchCardImage element not found");
}

});
