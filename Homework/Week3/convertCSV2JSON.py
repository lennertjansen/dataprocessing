# Convert CSV to JSON

import csv
import json

csvfile = open('2017.csv', 'r')
jsonfile = open('2017.json', 'w')

fieldnames = ("Country", "Happiness.Rank", "Happiness.Score", "Economy..GDP.per.Capita.")
reader = csv.DictReader(csvfile, fieldnames)
for row in reader:
    json.dump(row, jsonfile)
    jsonfile.write('\n')
