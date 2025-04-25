
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      console.log('目标元素进入视口了');
    } else {
      console.log('目标元素离开视口了');
    }
  });
}, {
  root: document.querySelector("#scrollArea"), // null -> 浏览器视口
  threshold: [0, 0.5, 1],
  rootMargin: "0px 0px -50px 0px",
});


const targetElement = document.querySelector('#target');

observer.observe(targetElement);