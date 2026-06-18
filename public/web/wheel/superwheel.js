"use strict";
(() => {
  (function() {
    "use strict";
    const container = document.getElementById("superwheel");
    if (!container) return;
    const superwheel = /* @__PURE__ */ (function(el, config) {
      return {
        stop: function(prize) {
          config.callback({ prize });
        }
      };
    })(container, {
      prize: "",
      callback: function() {
      }
    });
    window.superwheel = superwheel;
  })();
})();
