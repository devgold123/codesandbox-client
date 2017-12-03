/* eslint-env worker */
/* eslint no-var: off, strict: off */

// "Polyfills" in order for all the code to run
self.global = self;
self.Buffer = {
  isBuffer: function() {
    return false;
  },
};
// eslint-disable-next-line
fs = module$1 = module = path = os = crypto = {};
self.process = { argv: [], env: { PRETTIER_DEBUG: true } };
self.assert = { ok: function() {}, strictEqual: function() {} };
self.require = function require(path) {
  return self[path.replace(/.+-/, '')];
};

importScripts('/static/js/prettier/index.js');
var prettier = index; // eslint-disable-line

var parsersLoaded = {};

self.onmessage = function(message) {
  var options = message.data.options || {};
  options.parser = options.parser || 'babylon';
  try {
    var formatted = formatCode(message.data.text, options);
  } catch (e) {
    self.postMessage({ error: e.message, text: message.data.text });
    return;
  }
  var doc;
  var ast;

  if (message.data.ast) {
    try {
      ast = JSON.stringify(
        prettier.__debug.parse(message.data.text, options),
        null,
        2
      );
    } catch (e) {
      ast = e.toString();
    }
  }

  if (message.data.doc) {
    lazyLoadParser('babylon');
    try {
      doc = prettier.__debug.formatDoc(
        prettier.__debug.printToDoc(message.data.text, options),
        { parser: 'babylon' }
      );
    } catch (e) {
      doc = e.toString();
    }
  }

  self.postMessage({
    formatted: formatted,
    text: message.data.text,
    doc: doc,
    ast: ast,
  });
};

function formatCode(text, options) {
  lazyLoadParser(options.parser);
  try {
    return prettier.format(text, options);
  } catch (e) {
    // Multiparser may throw if we haven't loaded the right parser
    // Load it lazily and retry!
    if (e.parser && !parsersLoaded[e.parser]) {
      lazyLoadParser(e.parser);
      return formatCode(text, options);
    }

    throw e;
  }
}

function lazyLoadParser(parser) {
  var script =
    parser === 'json' ? 'parser-babylon.js' : 'parser-' + parser + '.js';

  if (!parsersLoaded[parser]) {
    importScripts('/static/js/prettier/' + script);
    parsersLoaded[parser] = true;
  }
}
