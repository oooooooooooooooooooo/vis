from json import loads, dumps
from itertools import imap
from sys import stdin, stdout

BUFFER_SIZE = 0x256

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

def main(*args):

	writer = Writer()
	for record in imap(loads, stdin):
		try:
			record['sending_time']
		except:
			pass
		try:
			del record['transact_time']
		except:
			pass
		del record['msg_seq_num']
		del record['tick_seq']
		del record['security_id']
		del record['epochs']
		try:
			del record['match_event_indicator']
		except:
			pass
		try:
			del record['rpt_seq']
		except:
			pass
		try:
			del record['n']
		except:
			pass
		writer.write(dumps(record))
	writer.flush()

if '__main__' == __name__:
	main()
