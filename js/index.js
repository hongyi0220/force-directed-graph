'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var App = function (_React$Component) {
   _inherits(App, _React$Component);

   function App(props) {
      _classCallCheck(this, App);

      var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

      _this.buildGraph = _this.buildGraph.bind(_this);
      return _this;
   }

   App.prototype.buildGraph = function buildGraph(dataset) {
      // Set dimensions
      var width = document.documentElement.clientWidth || window.innerWidth;
      var height = document.documentElement.clientHeight || window.innerHeight;
      var svgWidth = width,
          svgHeight = 500;
      var radius = 2;
      var nodes = dataset.nodes;
      var links = dataset.links;
      var svg = d3.select('.container').append('svg').attr('width', svgWidth).attr('height', svgHeight);
      // Calculate title height
      var title = document.querySelector('.title');
      var titleHeight = title.clientHeight;

      var tooltip = d3.select('.tooltip').style('visibility', 'hidden');

      var ticked = function ticked() {
         node.style('left', function (d) {
            return d.x - 7 + 'px';
         }).style('top', function (d) {
            return d.y + titleHeight + 'px';
         });

         link.attr('x1', function (d) {
            return d.source.x;
         }).attr('y1', function (d) {
            return d.source.y;
         }).attr('x2', function (d) {
            return d.target.x;
         }).attr('y2', function (d) {
            return d.target.y;
         });
      };

      var simulation = d3.forceSimulation(nodes).force('link', d3.forceLink(links).distance(30)).force('center', d3.forceCenter(svgWidth / 2, svgHeight / 2)).force('X', d3.forceX([svgWidth / 4])).force('Y', d3.forceY([svgHeight / 2])).force('X', d3.forceX([svgWidth * (3 / 4)])).force('Y', d3.forceY([svgHeight / 2])).force('charge', d3.forceManyBody().strength(-50)).force('collision', d3.forceCollide().radius(radius)).on('tick', ticked);
      // Drag event-handlers
      var started = function started(d) {
         if (!d3.event.active) simulation.alphaTarget(0.3).restart();
         d.fx = d.x;
         d.fy = d.y;
      };

      var dragged = function dragged(d) {
         d.fx = d3.event.x;
         d.fy = d3.event.y;
      };
      var ended = function ended(d) {
         if (!d3.event.active) simulation.alphaTarget(0);
         d.fx = null;
         d.fy = null;
      };

      var link = svg.append('g').attr('class', 'links').selectAll('line').data(links).enter().append('line');

      var node = d3.select('.container').attr('width', svgWidth).attr('height', svgHeight).selectAll('img').data(nodes).enter().append('img').style('position', 'absolute').attr('width', 1).attr('height', 1).attr('class', function (d) {
         return 'flag flag-' + d.code;
      }).call(d3.drag().on('start', started).on('drag', dragged).on('end', ended)).on('mousemove', function (d) {
         tooltip.style('visibility', 'visible').style('left', d3.event.x - radius * 5 + 'px').style('top', d3.event.y - radius * 11 + 'px').html(d.country);
      }).on('mouseout', function (d) {
         tooltip.style('visibility', 'hidden');
      });
   };

   App.prototype.componentDidMount = function componentDidMount() {
      var _this2 = this;

      var source = 'https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json';
      d3.json(source, function (dataset) {
         _this2.buildGraph(dataset);
      });
   };

   App.prototype.render = function render() {
      return React.createElement(
         'div',
         { className: 'container' },
         React.createElement('div', { className: 'tooltip' }),
         React.createElement(
            'div',
            { className: 'title' },
            'State Contiguity'
         )
      );
   };

   return App;
}(React.Component);

ReactDOM.render(React.createElement(App, null), document.getElementById('app'));