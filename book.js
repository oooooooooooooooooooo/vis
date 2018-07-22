const EPSILON = .0000001
function near(a, b) {
	return Math.abs(a - b) < EPSILON;
}

class Level {

	constructor(raw_px) {
		this.raw_px = raw_px
		this.orders = []
	}

	add(record) {
		const position = this.orders.findIndex(order => order.priority > record.priority);
		if(-1 === position)
			this.orders.push(record);
		else
			this.orders.splice(position, 0, record);
	}

	remove(record) {
		const position = this.orders.findIndex(order => order.id === record.id);
		console.assert(-1 !== position);
		this.orders.splice(position, 1);
	}

	update(record) {
		const position = this.orders.findIndex(order => order.id === record.id);
		console.assert(-1 !== position);
		const original_order = this.orders[position];
		if(original_order.priority === record.priority)
			this.orders[position] = record;
		else {
			this.orders.splice(position, 1);
			this.add(record);
		}
	}

	empty() {
		return this.orders.length === 0;
	}

	exportGeometry(geometries, px_scale) {
		let x = 0;
		const half_scale = px_scale * .5;
		for(const order of this.orders) {
			const plane = new THREE.PlaneGeometry(order.qty, px_scale);
			plane.translate(x, order.raw_px + half_scale);
			geometries.push(plane);
			x += order.qty;
		}
	}

	print() {
		console.log('' + this.raw_px + ' [' + this.orders.map(order => order.qty).join(' ') + ']');
	}
}

class Side {

	constructor(side) {
		this.levels = []
		this.id_to_px = { }
		this.side = side
	}

	add(record) {
		this.get_or_create_level(record.raw_px).add(record);
		this.id_to_px[record.id] = record.raw_px
	}

	remove(record) {
		const level_index = this.levels.findIndex(level => near(level.raw_px, record.raw_px));
		console.assert(-1 !== level_index);
		const level = this.levels[level_index];
		level.remove(record);
		if(level.empty()) {
			this.levels.splice(level_index, 1);
		}
		delete this.id_to_px[record.id];
	}

	update(record) {
		const level_index = this.levels.findIndex(level => near(level.raw_px, this.id_to_px[record.id]))
		const original_level = this.levels[level_index];
		if(!near(original_level.raw_px, record.raw_px)) {
			original_level.remove(record);
			if(original_level.empty()) {
				this.levels.splice(level_index, 1);
			}
			return this.add(record);
		}
		else
			original_level.update(record);

		this.id_to_px[record.id] = record.raw_px
	}

	get_or_create_level(raw_px) {
		const level_index = this.levels.findIndex(level => near(level.raw_px, raw_px));
		if(-1 !== level_index)
			return this.levels[level_index]

		const new_level = new Level(raw_px);
		this.levels.push(new_level);
		return new_level;
	}

	cmp(a, b) {
		console.assert(a.side === b.side);
		console.assert(!near(a.raw_px, b.raw_px));
		return a.side == 'B' ? a.raw_px < b.raw_px ? -1 : 1 : a.raw_px > b.raw_px ? -1 : 1;
	}

	print() {
		this.levels.sort(this.cmp);
		for(const level of this.levels)
			level.print()
	}

	exportGeometry(geometries, px_scale) {
		this.levels.sort(this.cmp);
		for(const level of this.levels)
			level.exportGeometry(geometries, px_scale);
	}
}

class Book {

	constructor(secdef) {
		this.secdef = secdef;
		this.bid = new Side('B');
		this.ask = new Side('A');
	}

	print() {
		this.ask.print();
		console.log('---------------------')
		this.bid.print();
	}

	exportGeometry() {
		const geometries = [];
		this.bid.exportGeometry(geometries, this.secdef.tickSizes[0].tickSize);
		this.ask.exportGeometry(geometries, this.secdef.tickSizes[0].tickSize);
		return geometries;
	}

	handle(record) {
		switch(record.event) {
			case 'A':
				('B' == record.side ? this.bid : this.ask).add(record);
				break;
			case 'U':
				('B' == record.side ? this.bid : this.ask).update(record);
				break;
			case 'R':
				('B' == record.side ? this.bid : this.ask).remove(record);
				break;
			case 'T':
			case 'D':
				break;
		}
	}

	handle_reverse(record){
		switch(record.event) {
			case 'A':
				('A' == record.side ? this.bid : this.ask).remove(record);
				break;
			case 'U':
				//Lookup previous record by id at nearest less timestamp
				break;
			case 'R':
				('A' == record.side ? this.bid : this.ask).add(record);
				break;
			case 'T':
			case 'D':
				break;
		}
	}
}
