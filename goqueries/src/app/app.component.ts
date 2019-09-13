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
    //   this.layout1 = $(go.LayeredDigraphLayout,
    //     { direction: 90, layeringOption: go.LayeredDigraphLayout.LayerLongestPathSource })

    // ;
    this.layout1 =
      $(go.TreeLayout,
        {
          angle: 90,
          arrangement: go.TreeLayout.ArrangementVertical,
          nodeSpacing: 10,
          layerSpacing: 5,
          setsPortSpot: false,
          setsChildPortSpot: false,
          // sorting:go.TreeLayout.SortingForwards

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
          { margin: 0, width: 250, height: 40 },
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
          relinkableFrom: true, relinkableTo: true,
          routing: go.Link.Orthogonal, fromSpot: go.Spot.Right, toSpot: go.Spot.Right
        }
      );

    this.diagram.model = new go.GraphLinksModel([
      { key: "A", color: "lightgreen" },
      { key: "B1", color: "yellow" },
      { key: "B2", color: "yellow" },
      { key: "C", color: "lightblue" },
      { key: "D1", color: "orange" },
      { key: "D2", color: "orange" },
      { key: "E", color: "pink" },
      { key: "F", color: "lightgreen" },
      { key: "Z1", color: "lightgreen" },
      { key: "Z2", color: "yellow" }
    ], [
        { from: "A", to: "B1", color: "green", "fromEndSegmentLength": 4, "toEndSegmentLength": 60 },
        { from: "B2", to: "C", color: "green", "fromEndSegmentLength": 4, "toEndSegmentLength": 60 },
        { from: "D1", to: "D2", color: "green", "fromEndSegmentLength": 4, "toEndSegmentLength": 60 },
        { from: "E", to: "F", color: "green", "fromEndSegmentLength": 4, "toEndSegmentLength": 60 },
        { from: "Z1", to: "Z2", color: "green", "fromEndSegmentLength": 4, "toEndSegmentLength": 60 },
        // { from: "A", to: "D2", color: "red", "fromEndSegmentLength": 4, "toEndSegmentLength": 40 }
      ]);

    this.layout1.doLayout(this.diagram);
  }

  ngOnInit() {
    this.diagram.div = this.diagramRef.nativeElement;
    // this.palette.div = this.paletteRef.nativeElement;
  }

}
