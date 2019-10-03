import {
  Component, OnInit, ViewChild, ElementRef, Input,
} from '@angular/core';
import * as go from 'gojs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  private diagram: go.Diagram;
  @ViewChild('diagramDiv')
  private diagramRef: ElementRef;

  @Input()
  get model(): go.GraphLinksModel { return this.diagram.model as go.GraphLinksModel; }
  set model(val: go.GraphLinksModel) { this.diagram.model = val; }
  layout1: any;
  constructor() {
    const $ = go.GraphObject.make;

    //code for licensing GoJS 
    // ******Do Not Touch******
    var style = document.createElement("style");
    style.appendChild(document.createTextNode(""));
    document.head.appendChild(style);
    (document.styleSheets[0] as CSSStyleSheet).insertRule('.gshHeader { border-color: #886d87; font-size: 10; margin-bottom: 7; }', 0);
    (go as any).licenseKey = "73f04ee5b01c28c702d90776423d6bf919a17564cf814aa4090413f3b90d3a06329feb2851d28e93d4ac49ff1e7dc28b8dc16f2094490c3de430d4db42e2d3aaba337be5400b4388f45626969eff2bf1ae6a61f497e571a288288de0fbabc29c54f7facb48cf";
    // ******Do Not Touch******

    this.diagram = new go.Diagram();
    this.diagram.undoManager.isEnabled = false;
    this.diagram.allowCopy = false;
    this.diagram.allowDelete = false;
    this.diagram.layout = new CustomLayout();

    this.diagram.initialContentAlignment = go.Spot.Center;
    this.diagram.allowDrop = true;
    var ins = this;
    
    this.diagram.nodeTemplateMap.add("Player",
        $(go.Node, "Auto",
          new go.Binding("location", "x", function (x) { return new go.Point(x, CustomLayout.Positions[1]); }).makeTwoWay(function (p) { return p.x; }),
          new go.Binding("text", "name", function (k) { return k.toString().padStart(10, "0"); }),
          $(go.Shape, "Circle",
            { fill: "lightblue", strokeWidth: 0 },
            new go.Binding("fill", "isHighlighted", function (h) { return h ? "red" : "lightblue"; }).ofObject()),
          $(go.TextBlock,
            { margin: 8 },
            new go.Binding("text", "name")),
          $(go.Picture,
            { margin: 0, width: 60, height: 60 },
            new go.Binding("source", "../assets/router.svg")
          )

        ));

      this.diagram.nodeTemplateMap.add("Game",
        $(go.Node, "Auto",
          new go.Binding("location", "x", function (x) { return new go.Point(x, CustomLayout.Positions[2]); }).makeTwoWay(function (p) { return p.x; }),
          new go.Binding("text", "name"),
          $(go.Shape,
            { fill: "lightgreen", stroke: "green", strokeWidth: 4 },
            new go.Binding("fill", "isHighlighted", function (h) { return h ? "red" : "lightgreen"; }).ofObject()),
          $(go.TextBlock,
            { margin: 18 },
            new go.Binding("text", "name")),
          $(go.Picture,
            { margin: 0, width: 60, height: 60 },
            new go.Binding("source", "../assets/router.svg")
          )
        ));

      this.diagram.nodeTemplateMap.add("Other",
        $(go.Node, "Auto",
          new go.Binding("location", "x", function (x) { return new go.Point(x, CustomLayout.Positions[0]); }).makeTwoWay(function (p) { return p.x; }),
          new go.Binding("text", "name"),
          $(go.Shape,
            { fill: "lightgreen", stroke: "orange", strokeWidth: 4 },
            new go.Binding("fill", "isHighlighted", function (h) { return h ? "red" : "orange"; }).ofObject()),
          $(go.TextBlock,
            { margin: 18 },
            new go.Binding("text", "name")),
          $(go.Picture,
            { margin: 0, width: 60, height: 60 },
            new go.Binding("source", "../assets/router.svg")
          )
        ));

      this.diagram.groupTemplate =
        $(go.Group,
          {
            locationSpot: go.Spot.Top,
            computesBoundsAfterDrag: true,
            layout: $(go.GridLayout,
              {
                wrappingWidth: Infinity,
                spacing: new go.Size(20, 20),
                comparer: function (a, b) {  // can re-order items within a row
                  var ax = a.location.x;
                  var bx = b.location.x;
                  if (isNaN(ax) || isNaN(bx)) return 0;
                  if (ax < bx) return -1;
                  if (ax > bx) return 1;
                  return 0;
                }
              })
          },
          $(go.Placeholder)
        );

    this.diagram.linkTemplate =
      $(go.Link,
        $(go.Shape, { strokeWidth: 3 },
          new go.Binding("stroke", "color"),
        ),

        {relinkableFrom: true, relinkableTo: true },

      
      );

    var tmp = {
      "nodeKeyProperty": "name", "linkKeyProperty": "name",
      "nodeGroupKeyProperty": "type",
      "nodeDataArray": [
        {"name":"Other", "isGroup":true},
        {"name":"Player", "isGroup":true},
        {"name":"Game", "isGroup":true},
        {"name":1, "type":"Game" },
        {"name":2, "type":"Game"},
        {"name":3, "type":"Game"},
        {"name":"A", "type":"Player"},
        {"name":"B", "type":"Player"},
        {"name":"C", "type":"Player"},
        {"name":"D", "type":"Player"},
        {"name":"E", "type":"Player" },
        {"name":"F", "type":"Player" },
        {"name":"Alpha", "type":"Other" },
        {"name":"Beta", "type":"Other" }
      ],
      "linkDataArray": [
        {"from":1, "to":"A"},
        {"from":1, "to":"B"},
        {"from":1, "to":"C"},
        {"from":1, "to":"D"},
        {"from":2, "to":"B"},
        {"from":2, "to":"C"},
        {"from":2, "to":"D"},
        {"from":2, "to":"E"},
        {"from":3, "to":"D"},
        {"from":3, "to":"E"},
        {"from":3, "to":"F"},
        {"from":"Alpha", "to":"Beta"},
        {"from":2, "to":"Alpha"},
        {"from":1, "to":2},
        {"from":2, "to":3},
        {"from":3, "to":"Beta"}
      ]
    }
   
    this.diagram.model =
      $(go.GraphLinksModel, tmp);
  }

  ngOnInit() {
    this.diagram.div = this.diagramRef.nativeElement;
  }

}
function CustomLayout() {
  go.Layout.call(this);
}

go.Diagram.inherit(CustomLayout, go.Layout);
CustomLayout.Positions = [0, 150, 300, 450, 600];

CustomLayout.prototype.doLayout = function (coll) {
  coll = this.collectParts(coll);
  this.diagram.commit(function (diag) {
    var y = 0;
    coll.each(function (g) {
      if (g instanceof go.Link) return;
      g.moveTo(0, CustomLayout.Positions[y++] || 0, true);
    });
  });
}