<p>
    <img height="103" width="349" alt="logo" src="https://raw.githubusercontent.com/andreldm/microconf/1185effa9386fb834f9764fabd3d807a6ca90032/assets/logo.png">
</p>

---

microconf is an ultra simple configuration management service meant for scenarios where other solutions such as Consul, ZooKeeper, doozerd and etcd would be way too much.

## Getting Started

* Get [Node.js](https://nodejs.org/)
* Install gulp and bower: `npm install -g gulp bower`
* `git clone https://github.com/andreldm/microconf`
* `cd microconf`
* `npm install`
* `bower install`
* `gulp`
* `npm start`

## Usage

microconf is inspired by etcd, so you can use curl as well to manage configurations and their values. As a bonus, you can easily manage them by using the frontend provided, go ahead and try: `http://localhost:3000`

That's all, you won't need to install any client, just manage the configurations via the frontend and consume the service via simple http requests. If you need something more evolved, please consider the aforementioned solutions.
