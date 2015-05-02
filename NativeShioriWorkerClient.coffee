NanikaStorage = @NanikaStorage
BrowserFS = @BrowserFS
_window = {}
BrowserFS.install(_window)
_path = _window.require 'path'
_buffer = _window.require 'buffer'

class NativeShioriWorkerClient

	# @abstract
	# @return [WorkerClient] SHIORI worker client
	worker: -> throw new Error 'worker() not implemented'

	# @param [node.js/BrowserFS Filesystem] fs the filesystem
	constructor: (@fs) ->

	# SHIORI 2.x/3.x load() and transfer files to worker on pre-load
	# @param [String] dirpath the 'ghost/master' path string that ends with path separator ('/' or '\')
	# @return [Promise<number>] load() response code
	load: (dirpath) ->
		result = dirpath.match /^(.+)ghost\/([^\/]+)\/ghost\/master\/$/
		fs_root = result[1]
		@dirpath = dirpath
		@ghostpath = result[2]
		@storage = new NanikaStorage(new NanikaStorage.Backend.FS(fs_root, @fs, _path, _buffer.Buffer))
		@_push(dirpath)
		.then =>
			@_load(dirpath)

	# @nodoc
	_push: (dirpath) ->
		@storage.ghost_master(@ghostpath)
		.then (directory) ->
			directory.asArrayBuffer()
		.then (directory) =>
			transferable = []
			for path, data of directory
				transferable.push data
			@worker().request('push', [dirpath, directory], transferable)

	# @nodoc
	_load: (dirpath) ->
		@worker().request('load', dirpath)

	# SHIORI 2.x/3.x request()
	# @param [String] request SHIORI 2.x/3.x Request string
	# @return [Promise<string>] request() response string
	request: (request) ->
		@worker().request('request', request)

	# SHIORI 2.x/3.x unload() and save files from worker on post-unload
	# @return [Promise<number>] unload() response code
	unload: ->
		@_unload()
		.then (code) =>
			@_pull(@dirpath)
			.then =>
				@worker().terminate()
			.then ->
				code

	# @nodoc
	_unload: ->
		@worker().request('unload')

	# @nodoc
	_pull: (dirpath) ->
		@worker().request('pull', dirpath)
		.then (directory) =>
			@storage.ghost_master(@ghostpath, new NanikaDirectory(directory))

@NativeShioriWorkerClient = NativeShioriWorkerClient
