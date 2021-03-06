/*
 * Copyright (c) 2021. Plotsensor Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from "react";
import {AdminPage, AdminMenu, AdminBC} from "./AdminPage"
import {Link, withRouter} from "react-router-dom";
import {GetAdminToken} from "./api";
import {DateTime} from "luxon";
import {AdminResourceTable} from "./AdminResourceTable";
import eyeSolid from "./eye-solid.svg";
import eyeSlashSolid from "./eye-slash-solid.svg"

function TagHeaderItem(props) {
    return(
        <tr>
            <th>ID</th>
            <th>Serial</th>
            <th>Secret Key <EyeButton hideSecret={props.hideSecret} eyeClicked={props.eyeClicked} /></th>
            <th>Firmware Version</th>
            <th>Hardware Version</th>
            <th>Description</th>
            <th>Date Created</th>
            <th>Time Created</th>
            <th></th>
        </tr>
    );
}

function TagListItem(props) {
      const dtUTC = DateTime.fromISO(props.resource['timeregistered']).setZone('utc');
      const datestamp = dtUTC.toLocaleString(DateTime.DATE_SHORT);
      const timestamp = dtUTC.toLocaleString(DateTime.TIME_24_WITH_SHORT_OFFSET);
      const seckeytype = props.hideSecret ? "password" : "text";
      return (
        <tr>
            <td><Link to={"/admin/tag/" + props.resource['id']}>{props.resource['id']}</Link></td>
            <td className="serialColumn"><Link to={"/tag/" + props.resource['serial']}>{props.resource['serial']}</Link></td>
            <td><input type={seckeytype} id="pass" className="secretkeyColumn" name="password" readOnly={true} size="16" value={props.resource['secretkey']} /></td>
            <td>{props.resource['fwversion']}</td>
            <td>{props.resource['hwversion']}</td>
            <td>{props.resource['description']}</td>
            <td>{datestamp}</td>
            <td>{timestamp}</td>
            <td><a href="#" onClick={() => props.deleteFcn(process.env.REACT_APP_WSB_ORIGIN + '/api/admin/tag/' + props.resource['id'])}>Delete</a></td>
        </tr>
      );
  }

  function AdminTagsBC(props) {
    return(
        <AdminBC>
            <li className="is-active"><a href="#" aria-current="page">Tags</a></li>
        </AdminBC>
    );
}

function EyeButton(props) {
    const backgroundImage = (props.hideSecret) ? `url(${eyeSolid})` : `url(${eyeSlashSolid})`;
       return (
            <a href="#" onClick={props.eyeClicked}
               className="icon" style={{backgroundImage: backgroundImage,
                                        height: "1em",
                                        width: "1em",
                                        verticalAlign: "middle",
                                        backgroundRepeat: "no-repeat",
                                        backgroundPosition: "center",
                                        backgroundSize: "100%"}}/>
        );
}

class AdminTagsList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
            redirect: false,
    };

    GetAdminToken.call(this);


  }

  render() {
      return(
          <AdminPage bc={<AdminTagsBC />} menu={<AdminMenu activetab='tags' />}>
            <AdminResourceTable
                {...this.props}
                ListItem={TagListItem}
                HeaderItem={TagHeaderItem}
                showAdd={true}
                url={process.env.REACT_APP_WSB_ORIGIN + '/api/admin/tags'}
            />

          </AdminPage>
      );
  }
}

export default withRouter(AdminTagsList);