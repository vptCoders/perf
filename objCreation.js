"use strict";

		let Baz = (function() {
			let pVar = 10;


			let Baz = function() {
			}

			Baz.prototype.mult = function(coef) {
				return pVar*coef;
			}


			return Baz;
		})();




		let m = new Baz();
		console.log(m.mult(5000));
		console.log(m instanceof Baz);




		let objFactory = function() {
			let pVar = 10;

			function Foo() {
			}

			Foo.prototype.mult = function(coef) {
				return pVar*coef;
			}

			return new Foo();
		};


		function Bar() {
			let pVar = 10;
			// this.a = 99;

			// The inside object will be called the same name as the outside object
			// so that the user reads "Bar" if he inspects obj2.
			function Bar() {
				// this.a = 100;
			}

			Bar.prototype.mult = function(coef) {
				// console.log(this.a) // -> outputs 100;
				return pVar*coef;
			}

			return new Bar();
		}


		function Qux() {
			this.pVar = 10;
		}

		Qux.prototype.mult = function(coef) {
			return this.pVar*coef;
		}

		let obj1 = objFactory();
		let obj2 = new Bar();
		let obj3 = new Qux();

		// Will not list pVar
		console.log(obj1);

		// Will not list pVar
		console.log(obj2);

		// Will list pVar
		console.log(obj3);
