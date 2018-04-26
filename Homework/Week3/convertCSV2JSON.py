# Convert CSV to JSON

import csv
import pandas
import json

# open csv file and create and open json file
csvfile = open('2016_manual.csv', 'r')
jsonfile = open('2016_manual.json', 'w')

# specify the fieldnames of the columns of interest
#fieldnames = ("Country", "Happiness.Rank", "Happiness.Score", "Economy..GDP.per.Capita.")
fieldnames = ("Country", "gdp_per_capita")

# csvfile_clean = pandas.read_csv('2017.csv', names=fieldnames)

reader = csv.DictReader(csvfile, fieldnames)
for row in reader:
    json.dump(row, jsonfile)
    jsonfile.write('\n')
