// Records have a "security_id"
// Construct one book per security ID and forward events


// Optionally filter for specific specurity IDs

class TransactionTimestamp {
    constructor(securities) {
        this.prev = -1;
        this.next = -1;
        this.target = [];
    }
}

class SecurityStream {
    //stream of events for given security
    constructor(){
        this.transactions = {};
        this.timestamps = {};
        this.current = -1;
		this.max;
		this.min;
    }

    load(trans_in){
        //load transactions for given time

        //lookup for epoch
        if (!(trans_in.epoch in this.transactions)){
            //generate new epoch entry for new epoch and load contents and add timestamp entry
            this.transactions[trans_in.epoch] = [];
            this.timestamps[trans_in.epoch] = new TransactionTimestamp();
            if (this.current == -1){
                this.current = trans_in.epoch;
				this.min = trans_in.epoch;
				this.max = trans_in.epoch;
            } else {
                this.timestamps[trans_in.epoch].prev = this.max;
                this.timestamps[this.max].next = trans_in.epoch;
				this.max = trans_in.epoch;
            }
        }
        this.transactions[trans_in.epoch].push(trans_in);

    }
    next(epoch_in){
        //update current to next in queue and return
        if (this.timestamps[this.current].next != -1)  {
            this.current = this.timestamps[this.current].next;
            return this.current;
        } else {
            return -1;
        }

    }
    prev(epoch_in){
        //update current to previous in queue and return
        if (this.timestamps[this.current].prev != -1)  {
            this.current = this.timestamps[this.current].prev;
            return this.current;
        } else {
            return -1;
        }
    }
    get(){
        return this.transactions[this.current];
    }


}

class EventStream {
    //Containter class of streams per security_id
    constructor() {
        this.securities = {};
        this.global_timestamps = {};
        this.current_time = -1;
        this.max_time = -1;
        this.min_time = -1;
    }


    load(trans_book){
        for (var i = 0; i<trans_book.length; i++){
			var transaction_entry = trans_book[i];
			transaction_entry['security_id'] = 100;
            //construct for new security_id
            if(!(transaction_entry.security_id in this.securities)){
                this.securities[transaction_entry.security_id] = new SecurityStream();
            }
            if(!(transaction_entry.epoch in this.global_timestamps)){
                this.global_timestamps[transaction_entry.epoch] = new TransactionTimestamp();
                this.global_timestamps[transaction_entry.epoch].prev = this.max_time;
                if (this.current_time == -1) {
                    this.current_time = transaction_entry.epoch;
                    this.min_time = transaction_entry.epoch;
                } else {
                    this.global_timestamps[this.max_time].next = transaction_entry.epoch;
                }
                this.max_time = transaction_entry.epoch;
            }
            if (this.global_timestamps[transaction_entry.epoch].target.indexOf(transaction_entry.security_id) == -1){
                this.global_timestamps[transaction_entry.epoch].target.push(transaction_entry.security_id);
            }
            //load() for existing security_id
            this.securities[transaction_entry.security_id].load(transaction_entry);
        }
    }
    next_tick(){
        if (this.current_time < this.max_time) {
            var res = [];
            //increment to next tick
            this.current_time = this.global_timestamps[this.current_time].next;

            //get all transactions for each security_id in timestamp
            for (var i = 0; i < this.global_timestamps[this.current_time].target.length; i++){
                var target_security = this.global_timestamps[this.current_time].target[i];
				res = res.concat(this.securities[target_security].get())
				this.securities[target_security].next();
            }

            var table_html = "<th scope = 'col'>Time</th><th scope = 'col'>Order</th><th scope = 'col'>Quantity</th><th scope = 'col'>Price</th>";
			$('#transaction_table').html(table_html);

            //update ui table
            for (var i = 0; i<res.length; i++){
				var transaction_item = res[i];
				$('#transaction_table').append("<tr><td>"+ (this.current_time % 10000000)+"</td><td>"+transaction_item['side']+"</td><td>"+transaction_item['qty']+"</td><td>"+transaction_item['px']+"</td></tr>");
            }

            //return collection
            return res;
        } else return -1;
    }

    prev_tick(){
        if (this.current_time > this.min_time) {
            var res = [];

            //decrement to previous tick
            this.current_time = this.global_timestamps[this.current_time].prev;

            //get all transactions for each security_id in timestamp
            for (var i = 0; i < this.global_timestamps[this.current_time].target.length; i++){
                var target_security = this.global_timestamps[this.current_time].target[i];
				res = res.concat(this.securities[target_security].get())
				this.securities[target_security].prev();
            }


            var table_html = "<th scope = 'col'>Time</th><th scope = 'col'>Order</th><th scope = 'col'>Quantity</th><th scope = 'col'>Price</th>";

			$('#transaction_table').html(table_html);

            //update ui table
            for (var i = 0; i<res.length; i++){
				var transaction_item = res[i];
				$('#transaction_table').append("<tr><td>"+ this.current_time+"</td><td>"+transaction_item['side']+"</td><td>"+transaction_item['qty']+"</td><td>"+transaction_item['px']+"</td></tr>");
            }
			//return collection
            return res;
        } else return -1;
    }
}
//TODO: "Order ID lookup"
