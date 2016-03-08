var _ = require("underscore");
var webdriver = require("selenium-webdriver");
var WebElement = require("selenium-webdriver").WebElement;
var assert = require("chai").assert;
var config = require("./config");

describe("Prueba de navegación automática", function() {
	this.timeout(30000);
	var driver;
	var server;
	before(function(done) {
		config.initServer(function(app2, server2) {
			server = server2;
			driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.firefox()).build();
			assert.ok(server);
			assert.ok(driver);
			done();
		}, true);
	});

	after(function() {
		server.close();
		driver.quit();
	});

	it("Abrir página principal", function(done) {
		driver.get("localhost:3000").then(function(res) {
			done();
		});
	});

	it("Comprobar título", function(done) {
		driver.getTitle().then(function(title) {
			assert.equal(title, "UGR Transparente | Universidad de Granada");
			done();
		});
	});

	it("Entrada menú", function(done) {
		driver.findElements(webdriver.By.className("item-first_level")).then(function(items) {
			_.each(items, function(item) {
				console.log(item.getText());
			});
			done();
		});
	});

});