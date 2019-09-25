import {
  Component, OnInit, ViewChild, ElementRef, Input,
  OnChanges, SimpleChanges, Output, EventEmitter
} from '@angular/core';
import * as go from 'gojs';
// "node_modules/gojs/extensionsTS/*"
// in the "includes" list of this project's tsconfig.json
import { GuidedDraggingTool } from 'gojs/extensionsTS/GuidedDraggingTool';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  private diagram: go.Diagram;
  // private palette: go.Palette = new go.Palette();

  @ViewChild('diagramDiv')
  private diagramRef: ElementRef;

  @Input()
  get model(): go.GraphLinksModel { return this.diagram.model as go.GraphLinksModel; }
  set model(val: go.GraphLinksModel) { this.diagram.model = val; }
  layout1: any;
  constructor() {
    const $ = go.GraphObject.make;
    this.layout1 =
    
        $(go.GridLayout,
          {
            wrappingColumn: 3,
            spacing : new go.Size(80,140)
          });

    this.diagram = new go.Diagram();
    this.diagram.initialContentAlignment = go.Spot.Center;
    this.diagram.allowDrop = true;
    this.diagram.undoManager.isEnabled = true;
    this.diagram.toolManager.draggingTool = new GuidedDraggingTool();
    var tmp = this;
    this.diagram.nodeTemplate =
      $(go.Node, "Spot",
        {
          fromLinkable: true, toLinkable: true,
          fromLinkableSelfNode: true, toLinkableSelfNode: true,
          fromLinkableDuplicates: true, toLinkableDuplicates: true
        },
        $(go.Panel, go.Panel.Auto,
          $(go.Shape,
            { minSize: new go.Size(60, 40), strokeWidth: 0 },
            { cursor: "pointer" },
          ),

          $(go.TextBlock,
            { margin: 8 /*, editable: true*/ },
            new go.Binding("text")/*.makeTwoWay()*/),
        ),
        $(go.Picture,
          // Pictures should normally have an explicit width and height.
          // This picture has a red background, only visible when there is no source set
          // or when the image is partially transparent.
          { margin: 0, width: 60, height: 60 },
          // Picture.source is data bound to the "source" attribute of the model data
          new go.Binding("source", "key", function (t) {

            return "../assets/download.png";
            // return t;
          }))
      );

    this.diagram.linkTemplate =
      $(go.Link,
        new go.Binding("fromEndSegmentLength"),
        new go.Binding("toEndSegmentLength"),
        // allow relinking
        $(go.Shape,
          new go.Binding("stroke", "color"),  // shape.stroke = data.color
          { strokeWidth: 3 }
        ),
        {
          relinkableFrom: false, relinkableTo: false,
          // routing: go.Link.Orthogonal,
           fromSpot: go.Spot.AllSides,
          toSpot: go.Spot.AllSides,
           routing: go.Link.AvoidsNodes,
          curve: go.Link.Bezier

        }
      );

    this.diagram.model = new go.GraphLinksModel([
      { key: "1", color: "lightgreen" },
      { key: "2", color: "yellow" },
      { key: "3", color: "yellow" },
      { key: "4", color: "lightblue" },
      { key: "5", color: "orange" },
      { key: "6", color: "orange" },
      { key: "7", color: "pink" },
      { key: "8", color: "lightgreen" },
      { key: "9", color: "lightgreen" },
      { key: "Z2", color: "yellow" }
    ], [
      { from: "1", to: "2", color: "green"},
        { from: "1", to: "4", color: "green"},
        { from: "1", to: "5", color: "green"},
        { from: "1", to: "6", color: "green"},
        { from: "2", to: "8", color: "blue"},
        { from: "3", to: "9", color: "blue"},
        { from: "7", to: "8", color: "red"},
        { from: "8", to: "9", color: "red"}
      ]);

    this.layout1.doLayout(this.diagram);
  }

  ngOnInit() {
    this.diagram.div = this.diagramRef.nativeElement;
    // this.palette.div = this.paletteRef.nativeElement;
  }

}
