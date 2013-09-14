#!/usr/bin/env python

import sys
import fileinput
from urlparse import urlparse

for line in fileinput.input():
	inURI = False
	for char in line:
		if char=="<":
			inURI = True
		if not inURI:
			sys.stdout.write('%s' % char)
			continue
		if char==">":
			inURI = False
			sys.stdout.write('%s' % char)
			continue
		if char!=" ":
			sys.stdout.write('%s' % char)
	sys.stdout.flush()
		
# bits = urlparse('mailto:one two')
#	print bits

        
