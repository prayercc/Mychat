# express-session-socket.io

Simple middleware to expose express session objects inside socket.io

## Example usage:
```
io.use(require('express-session-socket.io')(sessionStore, 'very Secure Secret', function (err, session, socket, next) {
    if (err) next(err);
    socket.session = session;
    next();
}));
```