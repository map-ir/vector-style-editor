import e from"react";import t from"./point/symbol-icon.js";import l from"./editor/base-on.js";import i from"./editor/opacity.js";import o from"./editor/line-type.js";import r from"./editor/title.js";var n=[{id:"symbol"},{id:"title",disabled:!1},{id:"other",disabled:!1}],a=[{id:"circle"},{id:"circle-outline",disabled:!1},{id:"title",disabled:!1},{id:"other",disabled:!1}],c=[{id:"line"},{id:"line-type",disabled:!1},{id:"title",disabled:!1},{id:"other",disabled:!1}],m=[{id:"fill"},{id:"fill-outline",disabled:!1},{id:"title",disabled:!1},{id:"other",disabled:!1}],d={symbol:e.createElement(e.Fragment,null,e.createElement(t,null),e.createElement(l,{type:"size"})),circle:e.createElement(e.Fragment,null,e.createElement(l,{type:"size"}),e.createElement(l,{type:"color"})),line:e.createElement(e.Fragment,null,e.createElement(l,{type:"size"}),e.createElement(l,{type:"color"})),fill:e.createElement(l,{type:"color"}),outline:e.createElement(e.Fragment,null,e.createElement(l,{type:"stroke"}),e.createElement(l,{type:"color"})),"circle-outline":e.createElement(e.Fragment,null,e.createElement(l,{type:"stroke-size"}),e.createElement(l,{type:"stroke-color"})),"fill-outline":e.createElement(e.Fragment,null,e.createElement(l,{type:"stroke-color"})),other:e.createElement(i,null),title:e.createElement(r,null),"line-type":e.createElement(o,null)},p={type:"symbol",layout:{"symbol-placement":"point","symbol-spacing":800,"icon-image":"empty-e71566","icon-size":1,"icon-allow-overlap":!1,"icon-ignore-placement":!1,"text-field":"","text-size":10,"text-font":["IranSans-Noto"],"text-anchor":"top","text-allow-overlap":!1,"text-ignore-placement":!1,"text-max-width":30}},s={type:"symbol",layout:{"symbol-placement":"line","symbol-spacing":800,"text-field":"","text-size":16,"text-font":["IranSans-Noto"],"text-anchor":"top","text-allow-overlap":!1,"text-ignore-placement":!1,"text-max-width":30}},y={type:"circle",paint:{"circle-stroke-color":"#2E0767","circle-stroke-width":1,"circle-color":"#E71566","circle-opacity":.5}},E={type:"line",layout:{"line-cap":"round","line-join":"miter"},paint:{"line-width":5,"line-color":"#2E0767","line-translate":[0,0]}},b={type:"fill",paint:{"fill-outline-color":"#2E0767","fill-color":"#E71566","fill-opacity":.1}};export{y as DefaultCircleLayer,b as DefaultFillLayer,E as DefaultLineLayer,p as DefaultSymbolLayer,s as DefaultTextLayer,a as circleTabs,d as components,m as fillTabs,c as lineTabs,n as symbolTabs};
//# sourceMappingURL=constants.js.map