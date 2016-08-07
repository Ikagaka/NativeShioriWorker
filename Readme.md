NativeShioriWorker - NativeShioriWorkerClient/NativeShioriWorkerServer
==========================

emscriptenで作られたSHIORIサブシステムをWebWorker/forkで扱うためのライブラリ「を作るためのライブラリ」です。

使用方法
--------------------------

WebWorkerの変換には結構な時間がかかります(数十秒～1分程度)。
```
makefork ShioriClassName shiori_loader_id shiori_module > shiori-fork.js
makewebworker ShioriClassName shiori_loader_id shiori_file.js > shiori-webworker.js
# あるいは
makewebworker all ShioriClassName shiori_loader_id shiori_file.js > shiori-webworker-all.js
```

```
<script src="bluebird.js"></script>
<script src="browserfs.js"></script>
<script src="NarLoader.js"></script>
<script src="NanikaStorage.js"></script>
<script src="NanikaStorage.backend.FS.js"></script>
<script src="WorkerClient.js"></script>
<script src="NativeShioriWorkerClient.js"></script>
<script src="ShioriLoader.js"></script>
<script src="shiori-webworker.js"></script>
```

```
<script src="browserfs.js"></script>
<script src="ShioriLoader.js"></script>
<script src="shiori-webworker-all.js"></script>
```

License
--------------------------

This is released under [MIT License](http://narazaka.net/license/MIT?2016).
