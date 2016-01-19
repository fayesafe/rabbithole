#!/usr/bin/env python3

import requests
import sys

def main(filename):
    with open(filename, 'rb') as post_file:
        r = requests.post('http://localhost:8000/', files={filename: post_file})
        print(r.text)


if __name__ == '__main__':
    try:
        main(sys.argv[1])
    except IndexError as e:
        print(e)
        print('Please provide an Input File...')
