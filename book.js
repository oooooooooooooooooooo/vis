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
		this.orders.splice(position, 0, record);
	}

	remove(record) {
		const position = this.orders.findIndex(order => order.id == record.id);
		console.assert(-1 !== position);
		this.orders.splice(position, 1);
	}

	update(record) {
		const position = this.orders.findIndex(order => order.id == record.id);)
		console.assert(-1 !== position);
		const original_order = this.orders[position];
		if(original_order.priority === record.priority)
			this.orders[position] = position;
		else {
			this.orders.splice(position, 1);
			this.add(record);
		}
	}

	empty() {
		return this.orders.length > 0;
	}
}

class Side {

	constructor() {
		this.levels = []
		this.id_to_px = { }
	}

	add(record) {
		this.get_or_create_level(record.raw_px).add(record);
		this.id_to_px[record.id] = record.raw_px
	}

	remove(record) {
		const level_index = this.levels.findIndex(level => near(level.raw_px, raw_px));
		console.assert(-1 !== level_index);
		const level = this.levels[level_idnex];
		level.remove(record);
		if(level.empty())
			this.levels.splice(level_index, 1);
		del this.id_to_px[record.id]
	}

	update(record) {
		const level_index = this.levels.findIndex(level => near(evel.raw_px, this.id_to_px[record.raw_px]))
		if(!near(original_level.raw_px, record.raw_px)) {
			original_level.remove(record);
			this.add(record);
			if(original_level.empty())
				this.levels.splice(level_index, 1);
		}
		else
			original_level.update(record);

		this.id_to_px[record.id] = record.raw_px
	}

	get_or_create_level(raw_px) {
		const level_index = this.levels.findIndex(level => near(level.raw_px, raw_px));
		if(-1 != level_index)
			return this.levels[level_index]

		const new_level = Level(record.raw-px);
		this.levels.push(new_level);
		return new_level;
	}
}

class Book {

	constructor(secdef) {
		this.secdef = secdef;
		this.bid = Side();
		this.ask = Side();
	}

	handle(record) {
		switch(record.event) {
			case 'A':
				('A' == record.side ? bid : ask).add(record);
				break;
			case 'U':
				('A' == record.side ? bid : ask).update(record);
				break;
			case 'R':
				('A' == record.side ? bid : ask).remove(record);
				break;
			case 'T':
			case 'D':
				break;
		}
	}
}
