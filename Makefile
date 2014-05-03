build: components
	@component build

components: component.json
	@component install

serve: node_modules
	@node app

node_modules: package.json
	@npm install

clean:
	rm -fr build components node_modules

.PHONY: serve clean