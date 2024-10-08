(function () {
	if (window.location.pathname !== "/" || window.location.search !== "") {
		return;
	}

	const bubbleContainer = document.createElement("div");
	bubbleContainer.style.height = "500px";
	bubbleContainer.id = "bubbles";

	const homePage = document.querySelector(".full-bg-img");
	homePage.appendChild(bubbleContainer);
	circleMagic();

	function circleMagic(options) {
		let width;
		let height;
		let canvas;
		let ctx;
		let animateHeader = true;
		const circles = [];

		const settings = options || {
			color: "rgba(255,255,255,.3)",
			radius: 10,
			density: 0.1,
			clearOffset: 0.7,
		};

		const container = document.getElementById("bubbles");
		initContainer();
		addListeners();

		function initContainer() {
			width = container.offsetWidth;
			height = container.offsetHeight - 120;

			initCanvas();
			canvas = document.getElementById("homeTopCanvas");
			canvas.width = width;
			canvas.height = height;
			canvas.style.position = "absolute";
			canvas.style.left = "0";
			canvas.style.bottom = "0";
			ctx = canvas.getContext("2d");

			for (let x = 0; x < width * settings.density; x++) {
				const c = new Circle();
				circles.push(c);
			}
			animate();
		}

		function initCanvas() {
			const canvasElement = document.createElement("canvas");
			canvasElement.id = "homeTopCanvas";
			canvasElement.style.pointerEvents = "none";
			container.appendChild(canvasElement);
			canvasElement.parentElement.style.overflow = "hidden";
		}

		function addListeners() {
			window.addEventListener("scroll", scrollCheck, false);
			window.addEventListener("resize", resize, false);
		}

		function scrollCheck() {
			if (document.body.scrollTop > height) {
				animateHeader = false;
			} else {
				animateHeader = true;
			}
		}

		function resize() {
			width = container.clientWidth;
			height = container.clientHeight;
			container.height = height + "px";
			canvas.width = width;
			canvas.height = height;
		}

		function animate() {
			if (animateHeader) {
				ctx.clearRect(0, 0, width, height);
				for (const i in circles) {
					circles[i].draw();
				}
			}
			requestAnimationFrame(animate);
		}

		function randomColor() {
			const r = Math.floor(Math.random() * 255);
			const g = Math.floor(Math.random() * 255);
			const b = Math.floor(Math.random() * 255);
			const alpha = Math.random().toPrecision(2);
			return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
		}

		function Circle() {
			const that = this;
			(function () {
				that.pos = {};
				init();
			})();
			function init() {
				that.pos.x = Math.random() * width;
				that.pos.y = height + Math.random() * 100;
				that.alpha = 0.1 + Math.random() * settings.clearOffset;
				that.scale = 0.1 + Math.random() * 0.3;
				that.speed = Math.random();
				if (settings.color === "random") {
					that.color = randomColor();
				} else {
					that.color = settings.color;
				}
			}
			this.draw = function () {
				if (that.alpha <= 0) {
					init();
				}
				that.pos.y -= that.speed;
				that.alpha -= 0.0005;
				ctx.beginPath();
				ctx.arc(that.pos.x, that.pos.y, that.scale * settings.radius, 0, 2 * Math.PI, false);
				ctx.fillStyle = that.color;
				ctx.fill();
				ctx.closePath();
			};
		}
	}
})();
