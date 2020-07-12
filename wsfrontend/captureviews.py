from flask import Blueprint, redirect, render_template, url_for, current_app
from werkzeug.exceptions import NotFound
from wsapiwrapper.consumer.tag import TagWrapper
from wsapiwrapper.consumer.capture import CaptureWrapper
# For GET and POST
from .defs import auth0_template, optional_auth, route
from dateutil import parser

# static_url_path needed because of http://stackoverflow.com/questions/22152840/flask-blueprint-static-directory-does-not-work
bp = Blueprint('captureview', __name__, template_folder='templates/pages/capture', static_folder='static',
               static_url_path='/static/frontend', url_prefix='/capture')


@bp.errorhandler(NotFound)
def handle_error(e):
    return render_template('errors/%s.html' % e.code), e.code


@route(bp, '/<int:captid>')
@optional_auth
def capture(captid, **kwargs):
    return redirect(url_for('captureview.temp', captid=captid))


@route(bp, '/<int:captid>/temp')
@optional_auth
def temp(captid, **kwargs):
    WSB_ORIGIN = current_app.config["WSB_ORIGIN"]
    tagwrapper = TagWrapper(baseurl=WSB_ORIGIN)
    capturewrapper = CaptureWrapper(baseurl=WSB_ORIGIN)

    capt = capturewrapper.get(captid)
    samples = capturewrapper.get_samples(captid)

    tag = tagwrapper.get(tagserial=capt['tagserial'])

    plotdata = []

    for sample in samples:
        smpl = {'t': sample['timestamp'], 'y': sample['temp']}
        plotdata.append(smpl)

    maxy = max(plotdata, key=lambda smpl: smpl.get('y')).get('y')
    miny = min(plotdata, key=lambda smpl: smpl.get('y')).get('y')

    return auth0_template('plot_page.html'
                          , tag=tag
                          , capture=capt
                          , temps=plotdata, miny=miny, maxy=maxy, sensor='temp', **kwargs)


@route(bp, '/<int:captid>/rh')
@optional_auth
def rh(captid, **kwargs):
    WSB_ORIGIN = current_app.config["WSB_ORIGIN"]
    capturewrapper = CaptureWrapper(baseurl=WSB_ORIGIN)
    capt = capturewrapper.get(captid)
    samples = capturewrapper.get_samples(captid)

    plotdata = []

    for sample in samples:
        smpl = {'t': sample['timestamp'], 'tHM': parser.parse(sample['timestamp']), 'y': sample['rh']}
        plotdata.append(smpl)

    maxy = max(plotdata, key=lambda smpl: smpl.get('y')).get('y')
    miny = min(plotdata, key=lambda smpl: smpl.get('y')).get('y')

    return auth0_template('plot_page.html'
                          , capture=capt
                          , temps=plotdata, miny=miny, maxy=maxy, sensor='rh', **kwargs)


@route(bp, '/<int:captid>/status')
@optional_auth
def status(captid, **kwargs):
    WSB_ORIGIN = current_app.config["WSB_ORIGIN"]
    capturewrapper = CaptureWrapper(baseurl=WSB_ORIGIN)
    capt = capturewrapper.get(captid)

    return auth0_template('status_page.html' \
                          , capture=capt
                          , **kwargs)
