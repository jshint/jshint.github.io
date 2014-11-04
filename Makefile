DEPLOY_BRANCH ?= master
DEPLOY_REMOTE ?= upstream

node_modules: package.json
	npm install

site: node_modules res
	git submodule update
	npm run build

.PHONY: deploy
deploy: site
	git checkout -B $(DEPLOY_BRANCH)
	git ls-files * | xargs git rm
	rmdir --ignore-fail-on-non-empty --parents */
	mv site/* .
	echo "jshint.com" > CNAME
	git add .
	git commit -m "Build site."
	git push --force $(DEPLOY_REMOTE) $(DEPLOY_BRANCH)
	git checkout -
