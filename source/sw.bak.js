importScripts("/static/js/common/sw-toolbox.js"),
    toolbox.router.get("/", self.toolbox.networkFirst, {
	cache: {
		name: "home-cache-v1",
		maxEntries: 10
	}
}), toolbox.router.get(/\.html$/, self.toolbox.networkFirst, {
	cache: {
		name: "page-cache-v1",
		maxEntries: 200
	}
})