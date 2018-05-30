"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var delineate = /** @class */ (function () {
    function delineate(target, opts) {
        this.elements = [];
        target = document.querySelectorAll(target);
        this.options = Object.assign({}, delineate.defaults, opts);
        for (var i = 0; i < target.length; i++) {
            var nextChildren = target[i].childNodes;
            if (nextChildren && nextChildren.length) {
                for (var j = 0; j < nextChildren.length; j++) {
                    var nextEl = nextChildren[j];
                    if (nextEl instanceof HTMLElement) {
                        this.elements.push(nextEl);
                    }
                }
            }
        }
        this.updateDelineation();
        // Update the delineation whenever the window resizes, but throttle to 15 FPS for performance
        window.addEventListener('resize', this.handleResize, false);
    }
    delineate.prototype.updateDelineation = function () {
        var prevOffset = null;
        var prevElement = null;
        var lines = [];
        for (var i = 0; i < this.elements.length; i++) {
            var nextEl = this.elements[i];
            nextEl.classList.remove('dl-first-in-line', 'dl-list-in-line');
            var style = window.getComputedStyle(nextEl);
            if (['block', 'inline-block', 'list-item', 'inline-flex'].indexOf(style.display) < 0) {
                return;
            }
            var offset = nextEl.offsetTop;
            if (offset !== prevOffset) {
                nextEl.classList.add('dl-first-in-line');
                lines[lines.length] = [];
                if (prevElement != null) {
                    prevElement.classList.add('dl-last-in-line');
                }
            }
            prevElement = nextEl;
            prevOffset = offset;
            lines[lines.length - 1].push(nextEl);
        }
        if (this.options.callback && typeof (this.options.callback) === 'function') {
            this.options.callback(lines);
        }
    };
    delineate.prototype.handleResize = function () {
        var _this = this;
        // ignore resize events as long as an actualResizeHandler execution is in the queue
        if (!this.resizeTimeout) {
            this.resizeTimeout = setTimeout(function () {
                _this.resizeTimeout = null;
                _this.updateDelineation();
                // The actualResizeHandler will execute at a rate of 15fps
            }, 66);
        }
    };
    delineate.defaults = {
        callback: null
    };
    return delineate;
}());
exports.delineate = delineate;
