.PHONY: all build clean re push pull run stop test help

PROJECT  ?= kr1sp1n/cavern
TAG      ?= latest
INSTANCE_NAME ?= cavern
PORT ?= 3000

RUN_OPTS = -p $(PORT):$(PORT) -e PORT=$(PORT)

DREDD ?= ./node_modules/.bin/dredd

ifdef REGISTRY
	IMAGE=$(REGISTRY)/$(PROJECT):$(TAG)
else
	IMAGE=$(PROJECT):$(TAG)
endif

all   : ## Build the container - this is the default action
all: build

install   : ## Install dependencies for testing
install:
	npm install

.built: .
	docker build -t $(IMAGE) .
	@docker inspect -f '{{.Id}}' $(IMAGE) > .built

build : ## Build the container
build: .built

run   : ## Run the container as a daemon locally for testing
run: build stop
	docker run -d --name=$(INSTANCE_NAME) $(RUN_OPTS) $(IMAGE)

stop  : ## Stop local test started by run
stop:
	-docker stop $(INSTANCE_NAME)
	-docker rm $(INSTANCE_NAME)

clean : ## Delete the image from docker
clean: stop
	@$(RM) .built
	-docker rmi $(IMAGE)

restart:
	docker-compose restart

test: build restart
	$(DREDD)

pull:
	docker pull $(IMAGE) || true

push:
	docker push $(IMAGE)

help  : ## Show this help
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//' | sed -e 's/##//'
