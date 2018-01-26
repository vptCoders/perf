"use strict";


function FFFrameWork() {
	function FFFrameWork() {
	}
	/***********************************************************************************************
	/*	Suppose we have:
	/*		let obj1 = new FFFrameWork();
	/*
	/*	The next line makes sure that:
	/*		console.log(obj1 instanceof FFFrameWork)
	/*	returns true.
	/***********************************************************************************************/
	FFFrameWork.prototype = Object.create(this.constructor.prototype);
	FFFrameWork.prototype.constructor = FFFrameWork;

	FFFrameWork.prototype.isEmpty = function(variable) {
		if(variable || Number.isFinite(variable)) {
			return false;
		} else {
			return true;
		}
	}

	FFFrameWork.prototype.validateCoordinate = function(coordinate) {
		if(Number.isFinite(coordinate)) {
			return true;
		} else {
			return false;
		}
	}

	/***********************************************************************************************
	/*	The next line makes sure that children of FFFrameWork can actually use its prototype methods.
	/***********************************************************************************************/
	this.constructor.prototype = FFFrameWork.prototype;
	return new FFFrameWork();
}




function FFStage(container) {
	let _parentObj = new FFFrameWork();
	this.constructor.prototype = Object.create(_parentObj);

	// 	Private properties:
	let	_CANVAS = null,
		_DEFAULT_STYLING_OPTIONS = {
			canvasWidth: 400,
			canvasHeight: 300,
		},
		_ERROR_MSG_EN = {
			em1001: "The container element passed to FFStage.setStage() cannot be a parent of canvas.",
			em1002: "The container element passed to FFStage() isn't a part of the visible DOM.",
			em1003: "No container element was passed to FFStage.setStage().",
		},
		_ERROR_MSG = _ERROR_MSG_EN;


	// 	Private methods:
	function existsOnDOM(element) {
		return document.body.contains(element);
	}

	// 	Constructor code:
	let FFStage = function(container) {
		_CANVAS = null;
		this.children = [];

		if(container) {
			this.setStage(container);
		}
	}
	FFStage.prototype = Object.create(this.constructor.prototype);
	FFStage.prototype.constructor = FFStage;


	// 	Public methods:
	FFStage.prototype.setStage = function(container) {
		if(container) {
			if(existsOnDOM(container)) {
				if(container.nodeName.toLowerCase() === "canvas") {
					_CANVAS = container;
				} else {
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

	FFStage.prototype.deleteObject = function(drawableObj) {
		let _numberOfChildren = this.children.length;
		let _foundChild = false;

		// 	Get the position of the object to delete inside this.children array:
		for(let _curObj = 0; _curObj < _numberOfChildren; _curObj++) {
			if(this.children[_curObj] === drawableObj) {
				_foundChild = true;
				// 	Remove the object from this.children:
				this.children.splice(_curObj, 1);
			}
		}

		if(_foundChild) {
			// 	Redraw the scene:
			this.redrawStage();
		}
	}

	FFStage.prototype.drawObject = function(drawableObj) {
		if(typeof drawableObj.draw === 'function') {
			this.children.push(drawableObj);
			drawableObj.draw(this);
		} else {
			// console.log("sad face");
		}
	}


	FFStage.prototype.redrawStage = function() {
		let _ctx = this.context2D;
		_ctx.clearRect(0, 0, _CANVAS.width, _CANVAS.height);


		let _numberOfChildren = this.children.length;
		for(let _curObj = 0; _curObj < _numberOfChildren; _curObj++) {
			this.drawObject(this.children[_curObj]);
		}
	}


	// 	Getters:
	Object.defineProperty(FFStage.prototype, 'context2D', {
		get: function() {
			return _CANVAS.getContext("2d"); 
		},
	});

	Object.defineProperty(FFStage.prototype, 'height', {
		get: function() {
			return _CANVAS.height; 
		},
	});

	Object.defineProperty(FFStage.prototype, 'width', {
		get: function() {
			return _CANVAS.width; 
		},
	});


	this.constructor.prototype = FFStage.prototype;
	return new FFStage(container);
}




function FFDrawableObject() {
	let _parentObj = new FFFrameWork();
	this.constructor.prototype = Object.create(_parentObj);

	// 	Private properties:

	//	Constructor code:
	function FFDrawableObject() {
	}
	FFDrawableObject.prototype = Object.create(this.constructor.prototype);
	FFDrawableObject.prototype.constructor = FFDrawableObject;

	FFDrawableObject.prototype.draw = function(stage) {
		// console.log(stage);
	}

	this.constructor.prototype = FFDrawableObject.prototype;
	return new FFDrawableObject();
}






function FFPoint(xPos, yPos, stylingObj) {
	let _parentObj = new FFDrawableObject();
	this.constructor.prototype = Object.create(_parentObj);


	// 	Private properties:
	let _COORDINATES = {
			x: 0,
			y: 0,
		},
		_DEFAULT_STYLING_OPTIONS = {
			radius: .5,
			fillColor: "black",
		/*	strokeColor: null,
			strokeType: "solid",*/
		},
		_ERROR_MSG_EN = {
			em1001: "A new FFPoint() cannot be created with the x coordinate defined.",
			em1002: "A new FFPoint() cannot be created with the y coordinate defined.",
			em1003: "A new FFPoint() cannot be created with a single coordinate defined.",
			em1004: "The x coordinate of the FFPoint() cannot be modified to the value defined.",
			em1005: "The y coordinate of the FFPoint() cannot be modified to the value defined.",
		},
		_ERROR_MSG = _ERROR_MSG_EN,
		_PARENT_STAGES = [];


	// 	Constructor code:
	function FFPoint(xPos, yPos, stylingObj) {
		this.styling = stylingObj ? stylingObj : {};

		/***********************************************************/
		/*	The constructor can be called with both coordinates
		/*	defined or with both undefined.
		/***********************************************************/
		// 
		// 	If both coordinates are defined:
		if(!this.isEmpty(xPos) && !this.isEmpty(yPos)) {
			if(this.validateCoordinate(xPos)) {
				_COORDINATES.x = xPos;
			} else {
				throw new Error(_ERROR_MSG.em1001);
				return;
			}

			if(this.validateCoordinate(yPos)) {
				_COORDINATES.y = yPos;
			} else {
				throw new Error(_ERROR_MSG.em1002);
				return;
			}

		// 	If both coordinates are undefined:
		} else if(this.isEmpty(xPos) && this.isEmpty(yPos)) {
			return;

		// 	If a single coordinate is defined:
		} else {
			throw new Error(_ERROR_MSG.em1003);
			return;
		}
	}
	FFPoint.prototype = Object.create(this.constructor.prototype);
	FFPoint.prototype.constructor = FFPoint;



	// 	Public methods:
	FFPoint.prototype.setStyle = function(stylingObj, updateParentStages) {
		this.styling = stylingObj;
		if(updateParentStages) {
			let _numberOfParentStages = _PARENT_STAGES.length;
			for(let _curStage = 0; _curStage < _numberOfParentStages; _curStage++) {
				_PARENT_STAGES[_curStage].redrawStage();
			}
		}
	}

	FFPoint.prototype.setCoordinates = function(xPos, yPos, setType) {
		function _changeCoordinates(xPos, yPos) {
			if(this.validateCoordinate(xPos)) {
				_COORDINATES.x = xPos;
			} else {
				throw new Error(_ERROR_MSG.em1004);
				return;
			}

			if(this.validateCoordinate(yPos)) {
				_COORDINATES.y = yPos;
			} else {
				throw new Error(_ERROR_MSG.em1005);
				return;
			}
		}

		/***********************************************************/
		/*	If setType is "relative": 
		/* 		_COORDINATES.x += xPos;
		/*		_COORDINATES.y += yPos;
		/*
		/*	If setType is "absolute":
		/*		_COORDINATES.x = xPos;
		/*		_COORDINATES.y = yPos;
		/***********************************************************/
		if(this.isEmpty(setType)) {
			_changeCoordinates.call(this, xPos, yPos);
		} else {
			switch(setType) {
				case "relative":
					_changeCoordinates.call(this, xPos + _COORDINATES.x, yPos + _COORDINATES.y);
					break;
				default:
				case "absolute":
					_changeCoordinates.call(this, xPos, yPos);
					break;
			}
		}
	}

	FFPoint.prototype.draw = function(stage) {
		let _numberOfParentStages = _PARENT_STAGES.length;
		let _foundParentStage = false;
		for(let _curStage = 0; _curStage < _numberOfParentStages; _curStage++) {
			if(_PARENT_STAGES[_curStage] === stage) {
				_foundParentStage = true;
			}
		}
		if(!_foundParentStage) {
			_PARENT_STAGES.push(stage);
		}

		let _ctx = stage.context2D;
		let _radius =  this.styling.radius ? this.styling.radius : _DEFAULT_STYLING_OPTIONS.radius;
		let _fillColor = this.styling.fillColor ? this.styling.fillColor : _DEFAULT_STYLING_OPTIONS.fillColor;

		_ctx.beginPath();
		_ctx.arc(_COORDINATES.x, _COORDINATES.y, _radius, 0, 2*Math.PI);
		_ctx.closePath();

		if(_fillColor) {
			_ctx.fillStyle = _fillColor;
			_ctx.fill();
		}
	}


	// 	Getters:
	Object.defineProperty(FFPoint.prototype, 'coordinates', {
		get: function() { 
			return _COORDINATES; 
		},
	});

	this.constructor.prototype = FFPoint.prototype;
	return new FFPoint(xPos, yPos, stylingObj);
}




let FFPlot = (function() {
	// 	Private properties common to all instances of the class:
	let _DEFAULT_STYLING_OPTIONS = {
			xAxisLineColor: "black",
			xAxisLineMarginBottom: 30.5,
			xAxisLineMarginLeft: 20,
			xAxisLineMarginRight: 20,
			xAxisLineThickness: 1,
			xAxisLineType: "solid",

			xAxisTitleColor: "black",
			xAxisTitleFont: "10px sans-serif",
			xAxisTitleHorizontalAlignment: "center",
			xAxisTitleLabel: "X axis title",
			xAxisTitleMarginBottom: 10,
			xAxisTitleMarginLeft: 10,
			xAxisTitleMarginRight: 10,
		},
		_ERROR_MSG_EN = {
			em1001: "A plot type needs to be defined before adding data to it.",
			em1002: "The data object cannot be empty.",
			em1003: "The plot object shall have the type property defined.",
			em1004: "The plot object cannot be empty.",
			em1005: "The plot type specified is invalid.",
			em1006: "The data object shall have both the x and y properties defined.",
		},
		_ERROR_MSG = _ERROR_MSG_EN;


	// 	Constructor code:
	let FFPlot = function(container, plotObj, dataObj, stylingObj) {
		this.data = {};
		this.plot = {};
		this.stage = new FFStage(container);
		this.styling = stylingObj ? stylingObj : {};

		if(plotObj) {
			this.setPlot(plotObj);
		}

		if(dataObj) {
			this.setData(dataObj);
		}
	}


	FFPlot.prototype.plotXAxisTitle = function() {
		let _ctx = this.stage.context2D;
		let _color = this.styling.xAxisTitleColor ? this.styling.xAxisTitleColor : _DEFAULT_STYLING_OPTIONS.xAxisTitleColor;
		_ctx.fillStyle = _color;
		let _font = this.styling.xAxisTitleFont ? this.styling.xAxisTitleFont : _DEFAULT_STYLING_OPTIONS.xAxisTitleFont;
		_ctx.font = _font;
		let _horizontalAlignment = this.styling.xAxisTitleHorizontalAlignment ? this.styling.xAxisTitleHorizontalAlignment : _DEFAULT_STYLING_OPTIONS.xAxisTitleHorizontalAlignment;
		let _marginBottom = this.styling.xAxisTitleMarginBottom ? this.styling.xAxisTitleMarginBottom : _DEFAULT_STYLING_OPTIONS.xAxisTitleMarginBottom;
		let _marginLeft = this.styling.xAxisTitleMarginLeft ? this.styling.xAxisTitleMarginLeft : _DEFAULT_STYLING_OPTIONS.xAxisTitleMarginLeft;
		let _marginRight = this.styling.xAxisTitleMarginRight ? this.styling.xAxisTitleMarginRight : _DEFAULT_STYLING_OPTIONS.xAxisTitleMarginRight;
		let _text = this.styling.xAxisTitleLabel ? this.styling.xAxisTitleLabel : _DEFAULT_STYLING_OPTIONS.xAxisTitleLabel;
		let _textWidth = _ctx.measureText(_text).width;

		switch(_horizontalAlignment) {
			default:
			case "center":
				_marginLeft = (this.stage.width - _textWidth)/2;
				break;
			case "left":
				break;
			case "right":
				_marginLeft = this.stage.width - _textWidth - _marginRight;
				break;
		}
		_ctx.fillText(_text, _marginLeft, this.stage.height - _marginBottom);
	}

	FFPlot.prototype.plotXAxis = function() {
		this.plotXAxisTitle();


		let _ctx = this.stage.context2D;
		let _color = this.styling.xAxisLineColor ? this.styling.xAxisLineColor : _DEFAULT_STYLING_OPTIONS.xAxisLineColor;
		_ctx.strokeStyle = _color;
		let _lineWidth = this.styling.xAxisLineThickness ? this.styling.xAxisLineThickness : _DEFAULT_STYLING_OPTIONS.xAxisLineThickness;
		_ctx.lineWidth = _lineWidth;
		let _marginBottom = this.styling.xAxisLineMarginBottom ? this.styling.xAxisLineMarginBottom : _DEFAULT_STYLING_OPTIONS.xAxisLineMarginBottom;
		let _marginLeft = this.styling.xAxisLineMarginLeft ? this.styling.xAxisLineMarginLeft : _DEFAULT_STYLING_OPTIONS.xAxisLineMarginLeft;
		let _marginRight = this.styling.xAxisLineMarginRight ? this.styling.xAxisLineMarginRight : _DEFAULT_STYLING_OPTIONS.xAxisLineMarginRight;
		let _yPos = this.stage.height - _marginBottom;
		let _xPos = this.stage.width - _marginRight;

		_ctx.beginPath();
		_ctx.moveTo(_marginLeft, _yPos);
		_ctx.lineTo(_xPos, _yPos);
		_ctx.closePath();
		_ctx.stroke();
	}

/*	FFPlot.prototype.plotData = function() {

	}*/

	FFPlot.prototype.setData = function(dataObj) {
		if(this.plot.type) {
			if(dataObj) {
				if("x" in dataObj && "y" in dataObj) {
					this.data = dataObj;
				} else {
					throw new Error(_ERROR_MSG.em1006);
					return;
				}
			} else {
				throw new Error(_ERROR_MSG.em1002);
				return;
			}
		} else {
			throw new Error(_ERROR_MSG.em1001);
			return;
		}
	}

	FFPlot.prototype.setPlot = function(plotObj) {
		if(plotObj) {
			if("type" in plotObj) {
				switch(plotObj.type) {
					case "scatter":
					case "line":
					case "parametric":
					case "yFunctionOfX":
					case "xFunctionOfY":
						this.plot = plotObj;
						break;
					default:
						throw new Error(_ERROR_MSG.em1005);
						return;
						break;
				}
			} else {
				throw new Error(_ERROR_MSG.em1003);
			}
		} else {
			throw new Error(_ERROR_MSG.em1004);
			return;
		}
	}

	return FFPlot;
})();




let FFScatterPlot = (function() {
	// 	Private properties common to all instances of the class:
	let _ERROR_MSG_EN = {
			em1001: "The data object shall have both the x and y properties defined.",
			em1002: "The data object cannot be empty.",
			em1003: "The x property of the data object shall be a single number or an array of numbers.",
			em1004: "The y property of the data object shall be a single number or an array of numbers.",
		},
		_ERROR_MSG = _ERROR_MSG_EN;

	// 	Constructor code:
	let FFScatterPlot = function(container, plotObj, dataObj, stylingOptions) {
		FFPlot.call(this, container, plotObj, dataObj, stylingOptions);
		this.plot.type = "scatter";
	}
	FFScatterPlot.prototype = Object.create(FFPlot.prototype);
	FFScatterPlot.prototype.constructor = FFScatterPlot;

	// 	Public methods:
	FFScatterPlot.prototype.plotData = function() {
		this.plotXAxis();


		if(this.data.x.constructor === Array) {
			let _numberOfPoints = this.data.x.length;
		} else {
			let _point = new FFPoint(this.data.x, this.data.y);
			this.stage.drawObject(_point);
		}
	}

	FFPlot.prototype.setData = function(dataObj) {
		if(dataObj) {
			if("x" in dataObj && "y" in dataObj) {
				if(dataObj.x.constructor !== Array && dataObj.x.constructor !== Number) {
					throw new Error(_ERROR_MSG.em1003);
					return;
				}

				if(dataObj.y.constructor !== Array && dataObj.y.constructor !== Number) {
					throw new Error(_ERROR_MSG.em1004);
					return;
				}
				this.data = dataObj;
			} else {
				throw new Error(_ERROR_MSG.em1001);
				return;
			}
		} else {
			throw new Error(_ERROR_MSG.em1002);
			return;
		}
	}

	return FFScatterPlot;
})();