export class delineate {

	static defaults: any = {
		callback: null
	};

	elements: HTMLElement[] = [];
	options: any;

	resizeTimeout: any;

	constructor(target, opts) {
		target = document.querySelectorAll(target);
		this.options = (<any>Object).assign({}, delineate.defaults, opts);

		for (let i = 0; i < target.length; i++) {
			let nextChildren: NodeList = target[i].childNodes;

			if (nextChildren && nextChildren.length) {
				for (let j = 0; j < nextChildren.length; j++) {
					let nextEl = nextChildren[j];

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

	updateDelineation() {
		let prevOffset = null;
		let prevElement = null;
		let lines = [];

		for (let i = 0; i < this.elements.length; i++) {
			let nextEl: HTMLElement = this.elements[i];
			nextEl.classList.remove('dl-first-in-line', 'dl-list-in-line');

			let style = window.getComputedStyle(nextEl);
			if (['block', 'inline-block', 'list-item', 'inline-flex'].indexOf(style.display) < 0) {
				return;
			}

			let offset = nextEl.offsetTop;
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

		if (this.options.callback && typeof(this.options.callback) === 'function') {
			this.options.callback(lines);
		}
	}

	handleResize() {
		// ignore resize events as long as an actualResizeHandler execution is in the queue
		if ( !this.resizeTimeout ) {
			this.resizeTimeout = setTimeout(() => {
				this.resizeTimeout = null;
				this.updateDelineation();

				// The actualResizeHandler will execute at a rate of 15fps
			}, 66);
		}
	}
}