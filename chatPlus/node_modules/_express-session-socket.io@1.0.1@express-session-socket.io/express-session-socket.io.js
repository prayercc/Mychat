var cookieParser = require('cookie-parser');
var cookie = require('cookie');

/**
 * Executes the middleware for an incoming client.
 *
 * @return {function} Returns socket.io 1.0+ middleware compatible function
 * @param {sessionStore} Express-Session compatible Session Store - requires sessionStore.get(sid, fn) support
 * @param {secret} Cookie secret
 * @param {callback} callback(err, session, socket, next) - callback function - put socket/session logic here
 * @api public
 */
module.exports = function (sessionStore, secret, callback) {
    return function (socket, next) {
        var data = cookie.parse(socket.handshake.headers.cookie);
        var sessionID = cookieParser.signedCookie(data['connect.sid'], secret);
        sessionStore.get(sessionID, function (err, session) {
            callback(err, session, socket, next);
        });
    };
};