#!/usr/bin/env python
# -*- coding: UTF-8 -*-
import csv
import re
i=0
rp = re.compile(r'^\d+$', )
num = 0
rows = []
# with open('test.csv', 'rb') as csvfile:
with open('客户档案.csv', 'rb') as csvfile:
	spamreader = csv.reader(csvfile, quotechar='|')
	for row in spamreader:
		num+=1
		if num == 1:
			continue
		if len(row) > 10 and row[11] and not rp.match(row[11]):
			print row[11]
			row[12] = row[11] + ' ' + row[12]
			row[11] = ''
		if len(row) > 7:
			row[12] = row[8] + ' ' + row[12]
			row[12] = row[9] + ' ' + row[12]
			row[12] = row[10] + ' ' + row[12]
			row[8] = row[11]
			row[9] = row[12]
		rows.append(row[:10])
with open('out.csv', 'wb') as csvfile:
	spamwriter = csv.writer(csvfile, quotechar='|', quoting=csv.QUOTE_MINIMAL)
	spamwriter.writerow(['姓名','球镜','柱镜','轴位','球镜','柱镜','轴位','瞳距', '联系电话', '备注'])
	for row in rows:
		spamwriter.writerow(row)

