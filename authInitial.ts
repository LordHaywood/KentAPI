import saml2 from 'saml2-js';
import fs from 'fs';
import express from 'express';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));

var sp = new saml2.ServiceProvider({
  entity_id: 'https://sso.id.kent.ac.uk/idp',
  private_key: fs.readFileSync("saml.pem").toString(),
  certificate: fs.readFileSync("saml.crt").toString(),
  assert_endpoint: 'https://kentcomputingsociety.co.uk/'
})

var idp_options = {
  sso_login_url: "https://sso.id.kent.ac.uk/idp/saml2/idp/SSOService.php",
  sso_logout_url: "https://sso.id.kent.ac.uk/idp/saml2/idp/SingleLogoutService.php",
  certificates: [fs.readFileSync("saml.crt").toString()]
};
var idp = new saml2.IdentityProvider(idp_options);

app.get("/metadata.xml", function(req, res) {
  res.type('application/xml');
  res.send(sp.create_metadata());
});
 
// Starting point for login
app.get("/login", function(req, res) {
  sp.create_login_request_url(idp, {}, function(err, login_url, request_id) {
    if (err != null)
      return res.send(500);
    res.redirect(login_url);
  });
});
 
// Assert endpoint for when login completes
app.post("/assert", function(req, res) {
  var options = {request_body: req.body};
  sp.post_assert(idp, options, function(err, saml_response) {
    if (err != null)
      return res.send(500);
 
    // Save name_id and session_index for logout
    // Note:  In practice these should be saved in the user session, not globally.
    name_id = saml_response.user.name_id;
    session_index = saml_response.user.session_index;
 
    res.send("Hello #{saml_response.user.name_id}!");
  });
});
 
// Starting point for logout
app.get("/logout", function(req, res) {
  var options = {
    name_id: name_id,
    session_index: session_index
  };
 
  sp.create_logout_request_url(idp, options, function(err, logout_url) {
    if (err != null)
      return res.send(500);
    res.redirect(logout_url);
  });
});
 
app.listen(3000);