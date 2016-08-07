NativeShioriWorker - NativeShioriWorkerClient/NativeShioriWorkerServer
==========================

emscriptenで作られたSHIORIサブシステムをWebWorker/forkで扱うためのライブラリ「を作るためのライブラリ」です。

使用方法
--------------------------

```
makefork ShioriClassName shiori_loader_id shiori_module > shiori-fork.js
makewebworker ShioriClassName shiori_loader_id shiori_file.js > shiori-webworker.js
```

```
<script src="browserfs.js"></script>
<script src="NarLoader.js"></script>
<script src="NanikaStorage.js"></script>
<script src="NanikaStorage.backend.FS.js"></script>
<script src="WorkerClient.js"></script>
<script src="NativeShioriWorkerClient.js"></script>
<script src="ShioriLoader.js"></script>
<script src="shiori-worker.js"></script>
```

License
--------------------------

This is released under [MIT License](http://narazaka.net/license/MIT?2016).
