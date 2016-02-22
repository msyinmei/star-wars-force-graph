ForceGraph = React.createClass({
  getInitialState() {
    return {
      width: window.innerWidth,
      height: 500
    };
  },
  componentWillMount() {
  },

  componentDidMount() {
    this.draw();
  },

  draw() {
    let {nodes, links} = this.props.data;
    let {width, height} = this.state;
    var forceLayout = d3.layout.force()
      .charge(-520)
      .linkDistance(100)
      .size([width, height])
      .nodes(nodes)
      .links(links)
      .linkStrength((d) => { return d.influence; })
      .start();
    
    let d3Svg = d3.select(ReactDOM.findDOMNode(this));
    let d3Nodes = d3Svg.selectAll('.node').data(nodes);
    let d3Links = d3Svg.selectAll('.link').data(links);

    forceLayout.on("tick", function() {
        d3Links.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        d3Nodes.attr('transform', (d) => {
          return `translate(${d.x}, ${d.y})`;
        }).call(forceLayout.drag);

      });
  },

  render() {
    let {nodes, links} = this.props.data;
    let {width, height} = this.state;
    let forceScale = d3.scale.linear().domain(d3.extent(nodes, (node) => { return node.force; })).range([5, 20]);
    let influenceScale = d3.scale.linear().domain(d3.extent(links, (link) => { return link.influence; })).range([1, 8]);
    return(
      <svg width={width} height={500}>
        <g>
          {links.map((link, i) => {
            return (
              <line key={i} className='link'
                style={{
                  stroke:'#999',
                  strokeWidth: influenceScale(link.influence)
                }}
              />
            );
          })}

          {nodes.map((node, i) => {
            return (
              <g key={i} className='node' width={100} height={50}>
                <circle 
                  r={forceScale(node.force)}
                  fill={node.group ? 'steelblue' : 'red'}
                />
                <text>{node.name}</text>
              </g>
            );
          })}
        </g>
      </svg>
    );
  }
});

App = React.createClass({
  getInitialState() {
    return {
      graph: graph
    };
  },

  render() {
    return(
      <div className='container-fluid'>
        <div className='row' style={{backgroundColor: 'black', textAlign:'center'}}>
          <img src="star_wars_logo.png" width={500}/>
          <h1 style={{color: 'white'}}>
            D3 Force Influence Graph
            <p className='small'>
              Each node represents how much force a character has and the link thickness represents their influence on each other.
            </p>
            <p className='small'>
              See the code on <a href='git@github.com:panw/star-wars-force-graph.git'>Github</a>
            </p>
            <p className='small'>
              Made with <a href='https://d3js.org/'>D3</a>, <a href='https://facebook.github.io/react/'>React</a>, and <a href='https://www.meteor.com/'>Meteor</a>
            </p>
          </h1>
        </div>
        <div className='row'>
          <ForceGraph
            data={this.state.graph}
          />
        </div>
      </div>
    );
  }
});

graph = {
  "nodes":[
    {"name":"Luke","group":1,"force":9},
    {"name":"Yoda","group":1,"force":8.5},
    {"name":"Obi Wan","group":1,"force":7},
    {"name":"Leia","group":1,"force":3},
    {"name":"Anakin","group":1,"force":9},
    {"name":"Rey","group":1,"force":5},    
    {"name":"Finn","group":1,"force":1},
    {"name":"Kylo Ren","group":0,"force":6},  
    {"name":"Snoke","group":0,"force":8},  
    {"name":"Vader","group":0,"force":9},
    {"name":"Sidious","group":0,"force":9.5},
    {"name":"Plagueis","group":0,"force":9.5}
  ],
  "links":[
    {"source":0,"target":1,"influence":9},
    {"source":0,"target":2,"influence":8},
    {"source":0,"target":3,"influence":5},
    {"source":0,"target":4,"influence":4},
    {"source":1,"target":0,"influence":7},
    {"source":1,"target":2,"influence":8},
    {"source":1,"target":3,"influence":1},
    {"source":1,"target":4,"influence":2},
    {"source":2,"target":0,"influence":8},
    {"source":2,"target":1,"influence":8},
    {"source":2,"target":3,"influence":2},
    {"source":2,"target":4,"influence":5},
    {"source":2,"target":9,"influence":2},
    {"source":3,"target":0,"influence":5},
    {"source":3,"target":2,"influence":4},    
    {"source":3,"target":4,"influence":1},
    {"source":3,"target":9,"influence":2},
    {"source":4,"target":0,"influence":4},
    {"source":4,"target":2,"influence":1},
    {"source":4,"target":9,"influence":10},
    {"source":5,"target":0,"influence":8},
    {"source":5,"target":3,"influence":3},
    {"source":5,"target":6,"influence":8},
    {"source":5,"target":7,"influence":6},
    {"source":6,"target":5,"influence":6},
    {"source":7,"target":0,"influence":2},
    {"source":7,"target":3,"influence":4},
    {"source":7,"target":5,"influence":4},
    {"source":7,"target":8,"influence":8},
    {"source":7,"target":9,"influence":9},
    {"source":8,"target":7,"influence":9},
    {"source":9,"target":7,"influence":7},
    {"source":9,"target":10,"influence":5},
    {"source":10,"target":4,"influence":9},
    {"source":10,"target":9,"influence":9},
    {"source":11,"target":10,"influence":4}
  ]
};

if (Meteor.isClient) {
  // This code is executed on the client only
 
  Meteor.startup(function () {
    // Use Meteor.startup to render the component after the page is ready
    ReactDOM.render(<App />, document.getElementById("render-target"));
  });
}

