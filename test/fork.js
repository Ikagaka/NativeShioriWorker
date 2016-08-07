if (typeof require !== 'undefined') {
  const assert = require('power-assert');
  const fs = require('fs');
  const path = require('path');
  const ShioriLoader = require('shioriloader');

  ShioriLoader.shiori_detectors = [
    (fs, dirpath, shiories) => new Promise((resolve) => resolve(new shiories.kawari(fs)))
  ];

  const dirpath = path.dirname(__filename).replace(/\\/g, '/').replace(/\/?$/, '/');

  const crlf = '\x0d\x0a';

  describe('fork worker', () => {
    before(() => require('./workers/kawari-fork.js'));
    it('works', () =>
      ShioriLoader.detect_shiori(fs, dirpath)
        .then((shiori) => shiori.load(dirpath)
          .then((ret) => assert(ret === 1))
          .then(() => shiori.request(`GET Version SHIORI/2.6${crlf}${crlf}`))
          .then((ret) => assert(ret === `SHIORI/3.0 200 OK${crlf}Craftman: KawariDeveloperTeam${crlf}ID: KAWARI.kdt${crlf}Version: 8.2.8${crlf}${crlf}`))
          .then(() => shiori.request(`GET SHIORI/3.0${crlf}ID: OnBoot${crlf}${crlf}`))
          .then((ret) => assert(ret === `SHIORI/3.0 200 OK${crlf}Charset: Shift_JIS${crlf}Value: getvalue${crlf}${crlf}`))
          .then(() => shiori.unload())
          .then((ret) => assert(ret === 1))
        )
    );
  });
}
