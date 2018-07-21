from json import loads, dumps
from itertools import imap, ifilter
from sys import stdin, stdout
from re import compile
from functools import partial

BUFFER_SIZE = 0x256
THIS_YEAR = 8
MCODES = 'FGHJKMNQUVXZ'

class Writer():

	def __init__(self):
		self.buffer = []

	def write(self, line):
		self.buffer.append(line)
		self.buffer.append('\n')
		if len(self.buffer) == BUFFER_SIZE:
			stdout.write(''.join(self.buffer))
			self.buffer = []

	def flush(self):
		stdout.write(''.join(self.buffer))

def sort_symbol(a, b):

	_, _, a_month, a_year = a['symbol']
	_, _, b_month, b_year = b['symbol']

	a_year = int(a_year)
	b_year = int(b_year)

	if 0 <= a_year < THIS_YEAR:
		a_year += 10

	if 0 <= b_year < THIS_YEAR:
		b_year += 10

	return cmp((a_year, a_month), (b_year, b_month))
	
def main(*args):

	sids = []
	writer = Writer()
	regex = compile('^GE[FGHJKMNQUVXZ]\d$')
	copy_fields = ('securityId', 'tickSizes', 'priceScale', 'symbol')
	filtered = ifilter(lambda record: regex.match(record['symbol']), imap(loads, stdin))
	sids = list({ k: record[k] for k in copy_fields } for record in filtered)
	sids.sort(sort_symbol)
	for sid in sids:
		writer.write(dumps(sid))
	writer.flush()

if '__main__' == __name__:
	main()
