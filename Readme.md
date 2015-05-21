NativeShioriWorker - NativeShioriWorkerClient/NativeShioriWorkerServer
==========================

emscriptenで作られたSHIORIサブシステムをWebWorkerで扱うためのライブラリ「を作るためのライブラリ」です。

レシピ
--------------------------

### SHIORIサブシステムをemscriptenで作ったものを用意

例として今回はkawari.jsとします。

### 依存ライブラリを入手

NativeShioriWorkerClientは[NanikaStorage](https://github.com/Ikagaka/NanikaStorage)と[BrowserFS](https://github.com/jvilk/BrowserFS)を必要とします。

NativeShioriWorkerServerは[nativeshiori](https://github.com/Narazaka/nativeshiori)と[encoding-japanese](https://github.com/polygonplanet/encoding.js)を必要とします。

また両方とも[WorkerClientServer](https://github.com/Narazaka/WorkerClientServer)と[bluebird](https://github.com/petkaantonov/bluebird)を必要とします。

NativeShioriWorkerServerが必要とするライブラリを全てダウンロードします。

### その栞向けのコードを書く

今回はCoffeeScriptで書くことにします。

次にクライアント(ブラウザ)側のコードを書きます。

まずサーバー(ワーカー)側のコードを書きます。

KawariWorker-server.coffee:

    # SHIORIの指定とNativeShioriWorkerServerのインスタンス化のみ。
    shiori = new Kawari()
    shiori_worker_server = new NativeShioriWorkerServer(shiori)

KawariWorker-client.coffee:

    # NativeShioriWorkerClientを継承したクラス
    class KawariWorkerClient extends @NativeShioriWorkerClient
      # worker_codeがインラインワーカーにするJavaScriptコードの文字列となる(下記のmake_worker_script.jsが出力する)。
      # クラス変数@urlに保存しておき、URLWorkerClientのコンストラクタ第二引数で、削除しないよう指定。
      # いちいちURLオブジェクトを作るのを防ぐ。
      @url = URL.createObjectURL(new Blob([worker_code], {type:"text/javascript"}))
      worker: -> @_worker
      # load()のみオーバーライド。
      load: (dirpath) ->
        # URLWorkerClientにURLをわたしてインラインワーカーを作る。
        @_worker = new URLWorkerClient(KawariWorkerClient.url, false)
        super(dirpath)
    
    # ShioriLoaderに登録する
    if @ShioriLoader?.shiories?
      @ShioriLoader.shiories.kawari = KawariWorkerClient
    else
      throw "load ShioriLoader first"

これらをcoffee-scriptでコンパイルしてKawariWorker-*.jsを作ってください。

### 結合

WebWorkerは別プロセスになるのはいいのですが、外部ファイルのライブラリを読み込むときパス指定をしなければなりません。

これが億劫なのでワーカーの依存ライブラリも全部結合します。

nativeshiori.js, WorkerClientServer.jsをおいたディレクトリで

    $ node make_worker_script.js KawariWorker-client.js KawariWorker-server.js kawari.js nativeshiori.js encoding.min.js bluebird.js WorkerServer.js NativeShioriWorkerServer.js > KawariWorker.js

クライアントスクリプト、サーバースクリプト、栞ライブラリ、nativeshiori.js、encoding.min.js、bluebird.js、WorkerServer.js、NativeShioriWorkerServer.jsの順で引数に書いてください。

スクリプトはSTDOUTに出るので適当なファイルにリダイレクトしてください。

こうして出来たKawariWorker.jsが配布可能なライブラリです。
KawariWorker.jsはNativeShioriWorkerClient.jsと同じ依存モジュールとNativeShioriWorkerClient.js自身を依存モジュールとします。

    <script src="browserfs.js"></script>
    <script src="NarLoader.js"></script>
    <script src="NanikaStorage.js"></script>
    <script src="NanikaStorage.backend.FS.js"></script>
    <script src="WorkerClient.js"></script>
    <script src="URLWorkerClient.js"></script>
    <script src="NativeShioriWorkerClient.js"></script>
    <script src="ShioriLoader.js"></script>
    <script src="KawariWorker.js"></script>

API
--------------------------

read the doc/ or *.coffee docs

License
--------------------------

This is released under [MIT License](http://narazaka.net/license/MIT?2015).
