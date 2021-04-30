document.addEventListener('DOMContentLoaded', function (event) {
  const sectionId = window.location.hash.substr(1, window.location.hash.length);
  console.log(sectionId);

  document.getElementById(sectionId).scrollIntoView();
});
