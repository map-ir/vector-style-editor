var n=function(n){return null!=n},r=function(n){return"string"==typeof n?parseFloat(n):n},t=function(n){var r,t,i;return null===(i=null===(t=null===(r=null==n?void 0:n.split(""))||void 0===r?void 0:r.map((function(n){return parseFloat(n)})))||void 0===t?void 0:t.filter((function(n){return!Number.isNaN(n)})))||void 0===i?void 0:i.join("")},i=function(n){if(!(n=n.toString()))return"";var r=["۰","۱","۲","۳","۴","۵","۶","۷","۸","۹"];return n.replace(/[0-9]/g,(function(n){return r[+n]}))},u=function(n){return(n=n.toString())?n.replace(/[۰-۹]/g,(function(n){return["۰","۱","۲","۳","۴","۵","۶","۷","۸","۹"].indexOf(n).toString()})):""};function o(n,r){for(var t=[],i=0;i<n.length/r;i++)t.push(n.slice(r*i,r*i+r));return t}export{n as isValue,o as splitArray,u as toEnDigits,i as toFaDigits,r as toNumber,t as toNumberString};
//# sourceMappingURL=index.js.map