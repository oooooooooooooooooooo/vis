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
        this.transactions = [];
        this.timestamps = [];
        this.current = -1;
    }

    load(trans_in){
        //load transactions for given time

        //lookup for epoch
        if (!(trans_in.epoch in transactions)){
            //generate new epoch entry for new epoch and load contents and add timestamp entry
            this.transactions[trans_in.epoch] = [];
            this.timestamps[trans_in.epoch] = new TransactionTimestamp();
            if (this.current == -1){
                this.current = trans_in.epoch;
                this.timestamps[trans_in.epoch].prev = -1;
            } else {
                this.timestamps[trans_in.epoch].prev = this.current;
                this.timestamps[this.current].next = trans_in.next;
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
        this.securities = [];
        this.global_timestamps = [];
        this.current_time = -1;
        this.max_time = -1;
        this.min_time = -1;
    }


    load(trans_book){
        for (transaction_entry in trans_book){

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
            for (target_security in this.global_timestamps[this.current_time].target){
                res = res.concat(this.securities[target_security].get())
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
            for (target_security in this.global_timestamps[this.current_time].target){
                res = res.concat(this.securities[target_security].get())
            }

            //return collection
            return res;
        } else return -1;
    }
}
//TODO: "Order ID lookup"
