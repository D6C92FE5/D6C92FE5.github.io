var $$current, $$svg, $$track, $heatmap, $sidebar, $sidebarToggle, chart, clientId, clientIds, data, drawPoints, entries, heatmap, hideTrack, i, mapHeight, mapWidth, page, showTrack, trafficData, xScale, yScale;

page = _.last(location.pathname.split('/')) || 'index';

$sidebar = $('.sidebar');

$sidebar.find('a[href^=\'' + page + '\']').parent().addClass('active');

$sidebarToggle = $('.sidebar-toggle');

$('.sidebar-toggle, .sidebar .mask').click(function() {
  $sidebarToggle.children('i').toggleClass('fa-navicon fa-times');
  return $sidebar.toggle();
});

mapWidth = 700;

mapHeight = 400;

xScale = d3.scale.linear().domain([0, mapWidth]).range([0, 100]).clamp(true);

yScale = d3.scale.linear().domain([0, mapHeight]).range([0, 100]).clamp(true);

if (page === 'heatmap') {
  $heatmap = $('.heatmap');
  heatmap = h337.create({
    container: $heatmap[0],
    maxOpacity: .7
  });
  $heatmap.children('canvas').attr('width', mapWidth).attr('height', mapHeight);
  data = (function() {
    var _i, _len, _ref, _results;
    _ref = _.range(200);
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      i = _ref[_i];
      _results.push({
        x: _.random(mapWidth),
        y: _.random(mapHeight),
        value: _.random(10, 30)
      });
    }
    return _results;
  })();
  heatmap.addData(data);
}

if (page === 'mall') {
  chart = c3.generate({
    bindto: '.chart',
    padding: {
      top: 20,
      bottom: 5,
      left: 50,
      right: 50
    },
    data: {
      x: 'x',
      columns: [['x', '2013-01-01', '2013-01-02', '2013-01-03', '2013-01-04', '2013-01-05', '2013-01-06'], ['mall', 30, 200, 100, 400, 150, 250]],
      names: {
        'mall': '平均11:00-14:00客流量达到最大值（单位：千）'
      },
      type: 'spline',
      labels: true
    },
    axis: {
      x: {
        type: 'timeseries',
        tick: {
          format: '%Y-%m-%d'
        }
      }
    },
    tooltip: {
      show: false
    }
  });
}

if (page === 'traffic') {
  clientIds = ['a', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l'];
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
  $$svg = d3.select('svg');
  $$current = $$svg.select('.current');
  $$track = $$svg.select('.track');
  drawPoints = function(data) {
    var circles;
    circles = $$current.selectAll('circle').data(data, function(d) {
      return d.clientId;
    });
    circles.enter().append('circle').on('click', showTrack).attr('class', 'point').attr('r', 5);
    return circles.transition().attr('cx', function(d) {
      return xScale(d.x) + '%';
    }).attr('cy', function(d) {
      return yScale(d.y) + '%';
    });
  };
  setInterval(function() {
    var item, _i, _len;
    data = _.sample(trafficData, _.random(4, trafficData.length));
    for (_i = 0, _len = data.length; _i < _len; _i++) {
      item = data[_i];
      item.x = Math.abs(item.x + _.random(-50, 50));
      item.y = Math.abs(item.y + _.random(-50, 50));
    }
    return drawPoints(data);
  }, 3000);
  entries = [
    {
      x: 340,
      y: 0
    }, {
      x: 0,
      y: 180
    }, {
      x: 550,
      y: 500
    }, {
      x: 700,
      y: 80
    }
  ];
  showTrack = function(d) {
    $$track.append('circle').on('click', hideTrack).attr('class', 'point').attr('r', 5).attr('cx', xScale(d.x) + '%').attr('cy', yScale(d.y) + '%');
    return $$current.transition().style('opacity', 0).each('end', function() {
      var drawTrack, points;
      $$current.classed('hide', true);
      points = (function() {
        var _i, _len, _ref, _results;
        _ref = _.range(0, _.random(2, 6));
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          i = _ref[_i];
          _results.push({
            x: _.random(mapWidth),
            y: _.random(mapHeight)
          });
        }
        return _results;
      })();
      points.unshift(_.sample(entries));
      points.push(d);
      drawTrack = function(i) {
        var p1, p2;
        p1 = points[i];
        p2 = points[i + 1];
        return $$track.append('circle').on('click', hideTrack).attr('class', 'point').attr('r', 5).attr('cx', xScale(p1.x) + '%').attr('cy', yScale(p1.y) + '%').style('opacity', 0).transition().style('opacity', 1).each('end', function() {
          return $$track.insert('line', ":first-child").attr('class', 'track').attr('x1', xScale(p1.x) + '%').attr('y1', yScale(p1.y) + '%').attr('x2', xScale(p1.x) + '%').attr('y2', yScale(p1.y) + '%').transition().duration(1000).attr('x2', xScale(p2.x) + '%').attr('y2', yScale(p2.y) + '%').each('end', function() {
            if (i < points.length - 2) {
              return drawTrack(i + 1);
            }
          });
        });
      };
      return drawTrack(0);
    });
  };
  hideTrack = function(d) {
    return $$track.selectAll('*').transition().style('opacity', 0).each('end', function() {
      d3.select(this).remove();
      return $$current.classed('hide', false).transition().style('opacity', 1);
    });
  };
  drawPoints(trafficData);
}
