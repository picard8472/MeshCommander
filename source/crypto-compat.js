/*
 * NW.js 0.106 and later ship Node.js 22+, which removed the deprecated
 * crypto.createCipher() and crypto.createDecipher() APIs. MeshCommander uses
 * them to store the computer list in localStorage, so restore the legacy
 * OpenSSL EVP_BytesToKey behavior on top of createCipheriv/createDecipheriv.
 */
(function () {
    var crypto = require('crypto');
    if ((typeof crypto.createCipher === 'function') && (typeof crypto.createDecipher === 'function')) return;

    function evpBytesToKey(password, keyLength, ivLength) {
        var passwordBuffer = Buffer.isBuffer(password) ? password : Buffer.from(String(password), 'utf8');
        var key = Buffer.alloc(0);
        var iv = Buffer.alloc(0);
        var prev = Buffer.alloc(0);
        while (key.length < keyLength) {
            prev = crypto.createHash('md5').update(prev).update(passwordBuffer).digest();
            key = Buffer.concat([key, prev]);
        }
        while (iv.length < ivLength) {
            prev = crypto.createHash('md5').update(prev).update(passwordBuffer).digest();
            iv = Buffer.concat([iv, prev]);
        }
        return { key: key.subarray(0, keyLength), iv: iv.subarray(0, ivLength) };
    }

    function derivedCipher(algorithm, password) {
        var info = crypto.getCipherInfo(algorithm);
        if (info == null) throw new Error('Unknown cipher: ' + algorithm);
        var derived = evpBytesToKey(password, info.keyLength, info.ivLength);
        return derived;
    }

    if (typeof crypto.createCipher !== 'function') {
        crypto.createCipher = function (algorithm, password) {
            var derived = derivedCipher(algorithm, password);
            return crypto.createCipheriv(algorithm, derived.key, derived.iv);
        };
    }

    if (typeof crypto.createDecipher !== 'function') {
        crypto.createDecipher = function (algorithm, password) {
            var derived = derivedCipher(algorithm, password);
            return crypto.createDecipheriv(algorithm, derived.key, derived.iv);
        };
    }
})();
