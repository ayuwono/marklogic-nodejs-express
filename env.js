/*
* Copyright 2014-2015 MarkLogic Corporation
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

var dev =  {
  database: "Documents", // Each connection can specify its own database
  host: "ayuwono-z620.marklogic.com",     // The host against which queries will be run
  port: 8000,            // By default port 8000 accepts Client API requests
  user: "admin",        // A user with at least the rest-writer role
  password: "admin",  // Probably not your password
  authType: "DIGEST"     // The default auth
}

module.exports = {
  connection: dev
}
