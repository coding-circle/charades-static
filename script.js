window.onload = () => {

  var teamBoxes = document.querySelectorAll('.team-box');

  var colors = generateColors(teamBoxes.length);

  /* theme each team box with a generated color */
  teamBoxes.forEach((teamBox, index) => {
    var backgroundElements = teamBox.querySelectorAll('.team-box__body, .team-box__team-label, .team-box__badge--status-on-deck');
    backgroundElements.forEach((element) => {
      element.style.background = colors[index];
    });

    var foregroundElements = teamBox.querySelectorAll('.team-box__player-name');
    foregroundElements.forEach((element) => {
      element.style.color = colors[index];
    });
  });
};

function generateColors(
  colorCount,
  startingHue = Math.floor(Math.random() * 360)
) {
  return new Array(colorCount)
    .fill('')
    .map((_, index) => {
      var hue = (startingHue + (Math.floor(360 / colorCount) * index)) % 360;
      return `hsl(${hue}, 100%, 75%)`
    });
}
