"use strict";


var FitAddon = void 0;
var MINIMUM_COLS = 2;
var MINIMUM_ROWS = 1;
var FitAddon = /** @class */ (function () {
    function FitAddon() {
    }
    FitAddon.prototype.activate = function (terminal) {
        this._terminal = terminal;
    };
    FitAddon.prototype.dispose = function () { };
    FitAddon.prototype.fit = function () {
        var dims = this.proposeDimensions();
        if (!dims || !this._terminal || isNaN(dims.cols) || isNaN(dims.rows)) {
            return;
        }
        // TODO: Remove reliance on private API
        var core = this._terminal._core;
        // Force a full render
        if (this._terminal.rows !== dims.rows || this._terminal.cols !== dims.cols) {
            core._renderService.clear();
            this._terminal.resize(dims.cols, dims.rows);
        }
    };
    FitAddon.prototype.proposeDimensions = function () {
        if (!this._terminal) {
            return undefined;
        }
        if (!this._terminal.element || !this._terminal.element.parentElement) {
            return undefined;
        }
        // TODO: Remove reliance on private API
        var core = this._terminal._core;
        var dims = core._renderService.dimensions;
        if (dims.css.cell.width === 0 || dims.css.cell.height === 0) {
            return undefined;
        }
        var scrollbarWidth = this._terminal.options.scrollback === 0 ?
            0 : core.viewport.scrollBarWidth;
        var parentElementStyle = window.getComputedStyle(this._terminal.element.parentElement);
        var parentElementHeight = parseInt(parentElementStyle.getPropertyValue('height'));
        var parentElementWidth = Math.max(0, parseInt(parentElementStyle.getPropertyValue('width')));
        var elementStyle = window.getComputedStyle(this._terminal.element);
        var elementPadding = {
            top: parseInt(elementStyle.getPropertyValue('padding-top')),
            bottom: parseInt(elementStyle.getPropertyValue('padding-bottom')),
            right: parseInt(elementStyle.getPropertyValue('padding-right')),
            left: parseInt(elementStyle.getPropertyValue('padding-left'))
        };
        var elementPaddingVer = elementPadding.top + elementPadding.bottom;
        var elementPaddingHor = elementPadding.right + elementPadding.left;
        var availableHeight = parentElementHeight - elementPaddingVer;
        var availableWidth = parentElementWidth - elementPaddingHor - scrollbarWidth;
        var geometry = {
            cols: Math.max(MINIMUM_COLS, Math.floor(availableWidth / dims.css.cell.width)),
            rows: Math.max(MINIMUM_ROWS, Math.floor(availableHeight / dims.css.cell.height))
        };
        return geometry;
    };
    return FitAddon;
}());
FitAddon = FitAddon;
