<p align="center">
    <img height="128" width="128" alt="logo" src="https://raw.githubusercontent.com/andreldm/microconf/master/assets/logo.png">
</p>

# microconf

microconf is an ultra simple configuration management service meant for scenarios where other solutions such as Consul, ZooKeeper, doozerd and etcd would be way too much.

## Getting Started

* Get [Node.js](https://nodejs.org/)
* Install gulp: `npm install -g gulp`
* `git clone https://github.com/andreldm/microconf`
* `cd microconf`
* `npm install`
* `gulp`
* `npm start`

## Usage

microconf is inspired by etcd, so you can use curl as well to manage configurations and their values. As a bonus, you can easily manage them by using the frontend provided, go ahead and try: `http://localhost:3000`

That's all, you won't need to install any client, just manage the configurations via the frontend and consume the service via simple http requests. If you need something more evolved, please consider the aforementioned solutions.