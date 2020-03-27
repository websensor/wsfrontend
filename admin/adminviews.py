from flask import Blueprint, render_template, redirect, flash, url_for
from .forms.boxes import AddBoxForm
from wsapiwrapper.admin.box import BoxWrapper
from .config import WSB_ORIGIN, ADMINAPI_CLIENTID, ADMINAPI_CLIENTSERET


# static_url_path needed because of http://stackoverflow.com/questions/22152840/flask-blueprint-static-directory-does-not-work
bp = Blueprint('dashboard', __name__, template_folder='templates', static_folder='static', static_url_path='/admin/static')


@bp.route('/', methods=['GET', 'POST'])
def home_page(**kwargs):
    form = AddBoxForm()
    boxwrapper = BoxWrapper(baseurl=WSB_ORIGIN,
                            adminapi_client_id=ADMINAPI_CLIENTID,
                            adminapi_client_secret=ADMINAPI_CLIENTSERET)

    if form.validate_on_submit():
        boxwrapper.post(boxid=form.box_id.data)
        flash("Box added")
        return redirect(url_for('dashboard.home_page'))

    boxlist = boxwrapper.get_many()

    return render_template('pages/home_page.html', form=form, boxlist=boxlist, **kwargs)


@bp.route('/box/<int:boxid>')
def box_page(boxid):
    boxwrapper = BoxWrapper(baseurl=WSB_ORIGIN,
                            adminapi_client_id=ADMINAPI_CLIENTID,
                            adminapi_client_secret=ADMINAPI_CLIENTSERET)
    box = boxwrapper.get(boxid)
    return render_template('pages/box/box_page.html', box=box)


@bp.route('/box/<int:boxid>/simulate')
def sim_page(boxid):
    boxwrapper = BoxWrapper(baseurl=WSB_ORIGIN,
                            adminapi_client_id=ADMINAPI_CLIENTID,
                            adminapi_client_secret=ADMINAPI_CLIENTSERET)

    simstr = boxwrapper.simulate(boxid=int(boxid), frontendurl="http://localhost:8080")
    return render_template('pages/box/sim_page.html', boxid=boxid, simstr=simstr)


@bp.route('/signin')
def signin():
    response = render_template('pages/signin_page.html', **kwargs)
    return response
