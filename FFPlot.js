"use strict";

let FFStage = (function() {

	// 	Private properties:
	let _CANVAS = null,
		_children = [],
		_DEFAULT_STYLING_OPTIONS = {
			canvasWidth: 400,
			canvasHeight: 300,
		},
		_ERROR_MSG_EN = {
			em1001: "The container element passed to FFStage.createStage() cannot be a parent of canvas.",
			em1002: "The container element passed to FFStage() isn't a part of the visible DOM.",
			em1003: "No container element was passed to FFStage.createStage().",
		},
		_ERROR_MSG = _ERROR_MSG_EN;


	// 	Private methods:
	function existsOnDOM(element) {
		return document.body.contains(element);
	}


	// 	Constructor code:
	let FFStage = function(container) {
		if(container) {
			this.createStage(container);
		}
	}


	// 	Public methods:
	FFStage.prototype.createStage = function(container) {
		if(container) {
			if(existsOnDOM(container)) {
				if(container.nodeName.toLowerCase() === "canvas") {
					_CANVAS = container;
				} else {
					// 	To do: check if _container can have a canvas element has a child.
					_CANVAS = document.createElement("canvas");
					_CANVAS.width = _DEFAULT_STYLING_OPTIONS.canvasWidth;
					_CANVAS.height = _DEFAULT_STYLING_OPTIONS.canvasHeight;

					try {
						container.appendChild(_CANVAS);
					} catch(err) {
						throw new Error(_ERROR_MSG.em1001);
					}
				}
			} else {
				throw new Error(_ERROR_MSG.em1002);
				return;
			}
		} else {
			throw new Error(_ERROR_MSG.em1003);
			return;
		}
		
	}

	FFStage.prototype.drawObject = function(obj) {

	}

	return FFStage;
})();




let FFDrawableObject = (function() {
	// 	Private properties:

	//	Constructor code:
	let FFDrawableObject = function() {

	}

	// FFObject.protot

	return FFDrawableObject;
})();