var $$svg, clientId, clientIds, currentHref, drawPoints, mapHeight, mapWidth, trafficData, xScale, yScale;

currentHref = _.last(location.pathname.split('/')) || 'index';

$('.sidebar').find('a[href^=\'' + currentHref + '\']').parent().addClass('active');

clientIds = ['a', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l'];

mapWidth = 700;

mapHeight = 400;

trafficData = (function() {
  var _i, _len, _results;
  _results = [];
  for (_i = 0, _len = clientIds.length; _i < _len; _i++) {
    clientId = clientIds[_i];
    _results.push({
      clientId: clientId,
      x: _.random(mapWidth),
      y: _.random(mapHeight)
    });
  }
  return _results;
})();

$$svg = d3.select('.traffic-box svg');

xScale = d3.scale.linear().domain([0, mapWidth]).range([0, 100]).clamp(true);

yScale = d3.scale.linear().domain([0, mapHeight]).range([0, 100]).clamp(true);

drawPoints = function(data) {
  var circle;
  circle = $$svg.selectAll('circle').data(data, function(d) {
    return d.clientId;
  });
  circle.enter().append('circle').attr('class', 'point').attr('r', 5);
  return circle.transition().attr('cx', function(d) {
    return xScale(d.x) + '%';
  }).attr('cy', function(d) {
    return yScale(d.y) + '%';
  });
};

drawPoints(trafficData);

setInterval(function() {
  var data, item, _i, _len;
  data = _.sample(trafficData, _.random(4, trafficData.length));
  for (_i = 0, _len = data.length; _i < _len; _i++) {
    item = data[_i];
    item.x = Math.abs(item.x + _.random(-50, 50));
    item.y = Math.abs(item.y + _.random(-50, 50));
  }
  return drawPoints(data);
}, 3000);
