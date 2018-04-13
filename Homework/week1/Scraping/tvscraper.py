#!/usr/bin/env python
# Name: Lennert Jansen
# Student number: 10488952
"""
This script scrapes IMDB and outputs a CSV file with highest rated tv series.
"""

import csv
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup

# import re for Regular Expressions Operations such as matching a given unicode
# argument with a href in a DOM.
import re

TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series"

BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'

def extract_tvseries(dom):
    """
    Extract a list of highest rated TV series from DOM (of IMDB page).
    Each TV series entry should contain the following fields:
    - TV Title
    - Rating
    - Genres (comma separated if more than one)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    """

    # create variable containing all list elements to be extracted.
    series_info = dom.find_all("div", class_="lister-item-content")

    # create empty list to be filled with lists containing the specifications
    # per individual tv show.
    series_list = []

    # use for loop to iterate through series_info and extract relevant info.
    for item in series_info:
        # create empty list to be filled specifications on a
        # tv show per iteration.
        series = []

        # locate title of current tv show, fill in a dash if not available.
        title = item.h3.a
        if not title:
            title = "-"
        else:
            title = title.text

        # locate rating of current tv show, fill in a dash if not available.
        rating = item.div.div.strong
        if not rating:
            rating = "-"
        else:
            rating = rating.text

        # locate genres of current tv show, fill in a dash if not available.
        genres = item.p.find("span", class_="genre")
        if not genres:
            genres = "-"
        else:
            genres = genres.text.strip()

        # locate actors of current tv show by matching href's containing the
        # word "name", fill list with these names and finally join the names
        # into a comma separated string.
        actors = item.find_all(class_="", href = re.compile("name"))
        temp_actors = []

        for actor in actors:
            temp_actors.append(actor.text)

        actors = ", ".join(temp_actors)

        # locate runtime of current tv show, fill in a dash if not available.
        runtime = item.p.find("span", class_ = "runtime")
        if not runtime:
            runtime = "-"
        else:
            runtime = runtime.text.strip(' min')

        # append title, rating, genres, actors and runtime to empty list for
        # individual tv show, and append this list to list of all series
        series.extend([title, rating, genres, actors, runtime])
        series_list.append(series)

    # ADD YOUR CODE HERE TO EXTRACT THE ABOVE INFORMATION ABOUT THE
    # HIGHEST RATED TV-SERIES
    # NOTE: FOR THIS EXERCISE YOU ARE ALLOWED (BUT NOT REQUIRED) TO IGNORE
    # UNICODE CHARACTERS AND SIMPLY LEAVE THEM OUT OF THE OUTPUT.
    print(series_list)

    return series_list   # REPLACE THIS LINE AS WELL AS APPROPRIATE

def save_csv(outfile, tvseries):
    """
    Output a CSV file containing highest rated TV-series.
    """
    writer = csv.writer(outfile)
    writer.writerow(['Title', 'Rating', 'Genre', 'Actors', 'Runtime'])

    # write every row with elements of a list containing info on one tv show,
    # and iterate through list of tv shows.
    for single_series in tvseries:
        writer.writerow(single_series)

def simple_get(url):
    """
    Attempts to get the content at `url` by making an HTTP GET request.
    If the content-type of response is some kind of HTML/XML, return the
    text content, otherwise return None
    """
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None
    except RequestException as e:
        print('The following error occurred during HTTP GET request to {0} : {1}'.format(url, str(e)))
        return None

def is_good_response(resp):
    """
    Returns true if the response seems to be HTML, false otherwise
    """
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200
            and content_type is not None
            and content_type.find('html') > -1)

if __name__ == "__main__":

    # get HTML content at target URL
    html = simple_get(TARGET_URL)

    # save a copy to disk in the current directory, this serves as a backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # parse the HTML file into a DOM representation
    dom = BeautifulSoup(html, 'html.parser')

    # extract the tv series (using the function you implemented)
    tvseries = extract_tvseries(dom)

    # write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'w', newline='') as output_file:
        save_csv(output_file, tvseries)
