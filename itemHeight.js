var itemHeight = (function(items, user_options) {
	var start = performance.now();
	if (typeof items == 'string') {
		items = document.querySelectorAll(items)
	}

	if (!items || typeof items != 'object') {
		return console.error('No items were provided');
	}

	if (user_options && typeof user_options != 'object') {
		return console.error('Please provide the options as an object');
	} else if (!user_options) {
		user_options = {};
	}

	var rows = [];
	var options = mergeOptions();

	function run() {
		fillRows();
		loopRows();
	}

	if (options.responsive) {
		setEventListeners();
	} else {
		run();
	}

	var end = performance.now();

	function fillRows() {
		var row = [];
		for (var i = 0; i < items.length; i++) {
			var item = items[i];

			// Reached max items in a row, create a new row
			if (row.length == options.items_in_row) {
				rows.push(row);
				row = [];
			}

			row.push(item);

			// Looped through all items
			if (i + 1 == items.length) {
				rows.push(row);
			}
		}
	}

	function loopRows() {
		for (var a = 0; a < rows.length; a++) {
			var row = rows[a];

			if (options.selectors) {
				for (var b = 0; b < options.selectors.length; b++) {
					setRowHeight(row, options.selectors[b]);
				}
			} else {
				setRowHeight(row);
			}
		}
	}

	function setRowHeight(row, qs) {
		var max = 0;

		for (var i = 0; i < row.length; i++) {
			var el = qs ? row[i].querySelector(qs) : row[i];
				el.style.minHeight = 0;

			// If there's only 1 item in a row we dont have to do anything but to remove the minHeight we've set
			if (options.items_in_row > 1) {
				var height = el.offsetHeight;
				if (height > max) {
					max = height;
				}
			}
		}

		if (options.items_in_row > 1) {
			for (var i = 0; i < row.length; i++) {
				var el = qs ? row[i].querySelector(qs) : row[i];
				el.style.minHeight = max + 'px';
			}
		}
	}

	function mergeOptions() {
		var options = {
			default: 3,
			items_in_row: 3,
			responsive: false,
			breakPoints: [],
			selectors: false,
		};

		// Items per row
		if (user_options.items_in_row) {
			var per_row = Number(user_options.items_in_row);
			if (!isNaN(per_row) && per_row > 0) {
				options.items_in_row = per_row;
				options.default = per_row;
			} else {
				console.error('`items_in_row` should be a number greater than 0');
			}
		}

		// Responsive
		if (user_options.responsive) {
			var responsive = user_options.responsive;
			if (typeof responsive != 'object') {
				console.error('Please provide `respsonsive` as an object');
			} else {
				options.responsive = responsive;
				options.breakPoints = Object.keys(responsive);
			}
		}

		// Selectors
		var selectors;
		if (selectors = user_options.selectors) {
			if (typeof selectors != 'object') {
				console.error('Please provide the selectors as an array or object');
			} else {
				options.selectors = selectors;
			}
		}

		return options;
	}

	function setEventListeners() {
		var resize_timeout;

		resizeTimeout(true);

		window.addEventListener('resize', function() {
			clearTimeout(resize_timeout);
			resize_timeout = setTimeout(resizeTimeout, 100);
		});

		function resizeTimeout(init) {
			var match = false;
			var recalc = false;

			for (var i = 0; i < options.breakPoints.length; i++) {
				var bp = options.breakPoints[i];
				var bp_amount = options.responsive[bp];

				if (window.innerWidth <= bp) {
					match = true;
					recalc = bp_amount != options.items_in_row;
					break;
				}
			}

			if (init) {
				options.items_in_row = match && recalc ? bp_amount : options.default;
				run();
			} else if (match && recalc) {
				options.items_in_row = bp_amount;
				run();
			} else if (!match && options.items_in_row != options.default) {
				options.items_in_row = options.default;
				run();
			}
		}
	}
});
