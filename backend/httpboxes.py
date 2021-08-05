#!/usr/bin/env python3
#
import argparse
import http.server
from urllib.parse import urlparse
import json
import math

def get_parser():
    parser = argparse.ArgumentParser()
    parser.add_argument('--port', type = int, default=8000)
    parser.add_argument('--staticdir', type = str, default="../frontend/dist")
    return parser



def calc_boxes_size(self, width,height,max_area):
    """Returns an array of tuples, describing 
    a list of boxes which will  will tile the widt xheigth
    request, each with an area  less than max_area

    Each tuple is start_col,tile_width,start_row,tile_height

    """
    area = width * height
    width = int(math.sqrt(area))
    height = int(math.sqrt(area))
    if max_area >= area:
        return [ (0, width, 0, height), ]
    else:
        boxes = []
        counter = 0
        totalArea = 0
        for newHeight in range(1, height):
            totalArea += (width * newHeight)
            if totalArea > area:
                break
            boxes.append((0, width, counter, newHeight))
            counter += newHeight
        areas = list(map(lambda box:box[1] * box[3], boxes))
        if max_area >= max(areas):
            return boxes
        else:
            return calc_boxes_size(self, width - 1, height - 1, max_area)


    # FIXME Actually verify max area, and
    # try to minimize sum(widths) + sum(heights)
    



def boxescalc(opts):
    class BoxesCalc(http.server.SimpleHTTPRequestHandler):
        def __init__(self,*args,**kwargs):
            kwargs['directory'] = opts.staticdir
            super().__init__(*args,**kwargs)

        def do_GET(self,*args):
            print(self.path,args)
            if self.path.startswith("/calculate/"): 
                parameters = self.path.split("/")
                # print(parameters)
                width = int(parameters[2])
                height = int(parameters[3])
                max_area = int(parameters[4])
                calc = calc_boxes_size(self, width, height, max_area)
                json_calc = json.dumps(calc)
                # print(json_calc)
                self.send_response(200)
                self.send_header( "Content-type", "json" )
                self.end_headers()
                self.wfile.write(bytes(json_calc, 'utf-8'))
                self.wfile.close()
                # self.send_error(404,"Implementation required")
            else:
                super().do_GET(*args)


    return BoxesCalc

def main(opts):
    listen_to = ('',opts.port)
    s = http.server.HTTPServer(listen_to, boxescalc(opts),)
    print("serving at port", opts.port)
    s.serve_forever()

if __name__ == "__main__":
    p = get_parser()
    opts = p.parse_args()
    main(opts)
