var assert = require('assert');

describe('Middleware', function () {
    describe('MemoryStore Support', function () {
        var express_session = require('express-session'),
            MemoryStore = new express_session.MemoryStore()
        
        var ess = null;
        var socket = null;

        before('Create ess', function () {
            ess = require('../express-session-socket.io.js')(MemoryStore, 'my balonga has a first name', function (err, session, socket, next) {
                if (err) next(err);
                socket.session = session;
                next();
            });
        });
        
        before('Create socket', function () { 
            socket = {
                handshake : {
                    headers: {
                        cookie : 'io=aDRQasm86aapCFLEAAAA; connect.sid=s%3ANb9IFS4Pa0r1Rn9u9Feh4YabETZtbt9u.WEGvzdDJeqa6yPzJXUR2tQUaNdifKWXJ36LCg7Z5jKc'
                    }
                }
            };
        });

        before('Create Session', function (go) {
            MemoryStore.set('Nb9IFS4Pa0r1Rn9u9Feh4YabETZtbt9u',       
                {
                data : 'helloworld', 
                cookie : {
                    expires : new Date(Date.now() + 1000000).toTimeString()
            
                }
            }                
            , function () { go() });
        });
        
        it('should return the session ', function (go) {
            ess(socket, function (err) {
                if (err) return go(err);
                if (socket.session) {
                    assert.equal( socket.session.data, 'helloworld', 'Expected data to equal \'helloworld\'');
                    go();
                }
            });
        });

        it('should fail to return the session', function (go) {
            ess(socket, function (err) {
                if (err) return go(err);
                if (socket.session) {
                    assert.notEqual(socket.session.data, 'not-helloworld', 'Expected data not to equal \'helloworld\'');;
                    go();
                }
            });
        });
    });
});