if (typeof window !== 'undefined') {
  ShioriLoader.shiori_detectors = [
    (fs, dirpath, shiories) => new Promise((resolve) => resolve(new shiories.kawari(fs)))
  ];

  const memfs = new BrowserFS.FileSystem.InMemory();
  BrowserFS.initialize(memfs);
  const fs = BrowserFS.BFSRequire('fs');
  const path = BrowserFS.BFSRequire('path');
  const dirpath = '/ika/ghost/tes/ghost/master/';
  fs.mkdirSync('ika');
  fs.mkdirSync('ika/ghost');
  fs.mkdirSync('ika/ghost/tes');
  fs.mkdirSync('ika/ghost/tes/ghost');
  fs.mkdirSync('ika/ghost/tes/ghost/master');
  fs.writeFileSync(path.join(dirpath, 'kawarirc.kis'), 'System.Callback.OnGET: getvalue');

  const crlf = '\x0d\x0a';

  describe('webworker worker', () => {
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
