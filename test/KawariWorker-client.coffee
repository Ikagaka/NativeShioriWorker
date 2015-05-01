class KawariWorkerClient extends NativeShioriWorkerClient
  @url = URL.createObjectURL(new Blob([worker_code], {type:"text/javascript"}))
  worker: -> @_worker
  load: (dirpath) ->
    @_worker = new URLWorkerClient KawariWorkerClient.url, false
    super(dirpath)

if @ShioriLoader?.shiories?
	@ShioriLoader.shiories.kawari = KawariWorkerClient
else
	throw "load ShioriLoader first"
