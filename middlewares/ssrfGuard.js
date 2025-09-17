const fetch = require("node-fetch");
const dns = require("dns").promises;
const net = require("net");

function isPrivateIP(ip) {
  return (
    ip.startsWith("10.") ||
    ip.startsWith("192.168.") ||
    ip.startsWith("172.16.") ||
    ip.startsWith("127.") ||
    ip === "::1"
  );
}

function ssrfGuard({ allowedHosts = [] }) {
  return async (req, res, next) => {
    req.safeFetch = async (url, options = {}) => {
      const host = new URL(url).hostname;

      if (!allowedHosts.includes(host)) {
        throw new Error("SSRF blocked: host not allowed");
      }

      const addresses = await dns.lookup(host, { all: true });
      if (addresses.some(addr => isPrivateIP(addr.address))) {
        throw new Error("SSRF blocked: private IP");
      }

      return fetch(url, options);
    };

    next();
  };
}

module.exports = ssrfGuard;
