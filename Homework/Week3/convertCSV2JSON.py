# Convert CSV to JSON

import csv
import pandas
import json

# open csv file and create and open json file
csvfile = open('2016_top19.csv', 'r')
jsonfile = open('2016_top19.json', 'w')

# specify the fieldnames of the columns of interest
fieldnames = ("Country", "gdp_per_capita")

# read into new json file and write the key value pairs per row
reader = csv.DictReader(csvfile, fieldnames)
for row in reader:
    json.dump(row, jsonfile)
    jsonfile.write(',\n')
